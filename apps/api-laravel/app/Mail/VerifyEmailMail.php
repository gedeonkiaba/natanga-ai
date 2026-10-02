<?php

declare(strict_types=1);

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Email de vérification du compte parent (lien mono-usage vers le client web).
 * Aucune donnée enfant n'y figure (minimisation RGPD).
 */
class VerifyEmailMail extends Mailable
{
    public function __construct(public readonly string $verifyUrl) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Natanga — confirmez votre adresse email');
    }

    public function content(): Content
    {
        $url = e($this->verifyUrl);

        return new Content(htmlString: <<<HTML
            <p>Bonjour,</p>
            <p>Pour activer votre compte parent Natanga, cliquez sur le lien ci-dessous
            (valable 24 heures) :</p>
            <p><a href="{$url}">{$url}</a></p>
            <p>Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement cet email.</p>
            HTML);
    }
}
