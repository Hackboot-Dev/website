// /workspaces/website/apps/web/app/api/careers/apply/route.ts
// Description: API endpoint for job applications
// Last modified: 2025-09-14
// Related docs: /docs/JOURNAL.md

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      jobId,
      firstName,
      lastName,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      coverLetter,
      experience,
      salary,
      availability,
      location,
      cv,
      gdprConsent
    } = body;

    // Validation basique
    if (!firstName || !lastName || !email || !jobId || !gdprConsent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // TODO: Intégrer avec un service d'email (SendGrid, AWS SES, etc.)
    // Pour l'instant, on simule l'envoi

    // Préparer les données pour l'email
    const applicationData = {
      jobId,
      candidate: {
        name: `${firstName} ${lastName}`,
        email,
        phone: phone || 'Non fourni',
        linkedin: linkedin || 'Non fourni',
        github: github || 'Non fourni',
        portfolio: portfolio || 'Non fourni'
      },
      coverLetter: coverLetter || 'Pas de lettre de motivation',
      experience: experience || 'Non spécifié',
      salary: salary || 'Non spécifié',
      availability: availability || 'Non spécifié',
      location: location || 'Non spécifié',
      cv: cv || 'Pas de CV attaché',
      timestamp: new Date().toISOString()
    };

    // Log pour le développement
    console.log('New job application received:', applicationData);

    // TODO: Sauvegarder en base de données
    // await saveApplication(applicationData);

    // TODO: Envoyer email de notification à l'équipe RH
    // await sendNotificationEmail('careers@vmcl.fr', applicationData);

    // TODO: Envoyer email de confirmation au candidat
    // await sendConfirmationEmail(email, firstName, jobId);

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        success: true,
        message: 'Application received successfully',
        applicationId: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing job application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optionnel : endpoint GET pour vérifier le statut
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'operational',
      message: 'Career application endpoint is working'
    },
    { status: 200 }
  );
}