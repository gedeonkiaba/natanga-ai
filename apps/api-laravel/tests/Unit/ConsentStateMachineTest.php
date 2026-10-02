<?php

declare(strict_types=1);

use App\Domain\Consent\ConsentStateMachine;

it('autorise PENDING → GRANTED', function () {
    $sm = new ConsentStateMachine();
    expect($sm->apply('PENDING', 'grant'))->toBe('GRANTED');
});

it('autorise PENDING → DENIED', function () {
    $sm = new ConsentStateMachine();
    expect($sm->apply('PENDING', 'deny'))->toBe('DENIED');
});

it('autorise GRANTED → REVOKED', function () {
    $sm = new ConsentStateMachine();
    expect($sm->apply('GRANTED', 'revoke'))->toBe('REVOKED');
});

it('autorise REVOKED → GRANTED (nouvelle version)', function () {
    $sm = new ConsentStateMachine();
    expect($sm->apply('REVOKED', 'grant'))->toBe('GRANTED');
});

it('refuse les transitions illégales', function () {
    $sm = new ConsentStateMachine();
    expect(fn () => $sm->apply('GRANTED', 'deny'))->toThrow(InvalidArgumentException::class);
    expect(fn () => $sm->apply('DENIED', 'revoke'))->toThrow(InvalidArgumentException::class);
    expect(fn () => $sm->apply('PENDING', 'revoke'))->toThrow(InvalidArgumentException::class);
});

it('considère un enfant actif uniquement si GRANTED', function () {
    expect(ConsentStateMachine::isChildActive('GRANTED'))->toBeTrue();
    expect(ConsentStateMachine::isChildActive('PENDING'))->toBeFalse();
    expect(ConsentStateMachine::isChildActive('REVOKED'))->toBeFalse();
    expect(ConsentStateMachine::isChildActive('DENIED'))->toBeFalse();
    expect(ConsentStateMachine::isChildActive('EXPIRED'))->toBeFalse();
});
