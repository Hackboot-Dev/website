// /workspaces/website/apps/web/app/api/careers/spontaneous/route.ts
// Description: API endpoint for spontaneous job applications
// Last modified: 2025-09-14
// Related docs: /docs/JOURNAL.md

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      position,
      expertise,
      experience,
      salary,
      availability,
      location,
      motivation,
      skills,
      languages,
      achievements,
      cv,
      portfolioFile,
      references,
      gdprConsent,
      type
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !position || !expertise || !motivation || !gdprConsent) {
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

    // Préparer les données
    const applicationData = {
      type: 'spontaneous',
      candidate: {
        name: `${firstName} ${lastName}`,
        email,
        phone: phone || 'Not provided',
        linkedin: linkedin || 'Not provided',
        github: github || 'Not provided',
        portfolio: portfolio || 'Not provided',
        location: location || 'Not specified'
      },
      professional: {
        desiredPosition: position,
        expertise,
        experience: experience || 'Not specified',
        salaryExpectations: salary || 'Not specified',
        availability: availability || 'Not specified',
        skills: skills || 'Not specified',
        languages: languages || 'Not specified'
      },
      motivation,
      achievements: achievements || 'Not provided',
      documents: {
        cv: cv || 'No CV attached',
        portfolio: portfolioFile || 'No portfolio attached'
      },
      canProvideReferences: references,
      gdprConsent,
      timestamp: new Date().toISOString()
    };

    // Log pour le développement
    console.log('New spontaneous application received:', applicationData);

    // TODO: Intégrer avec service d'email
    // await sendNotificationEmail('careers@vmcl.fr', applicationData);
    // await sendConfirmationEmail(email, firstName);

    // TODO: Sauvegarder en base de données
    // await saveSpontaneousApplication(applicationData);

    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        success: true,
        message: 'Spontaneous application received successfully',
        applicationId: `SPONT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing spontaneous application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'operational',
      message: 'Spontaneous application endpoint is working'
    },
    { status: 200 }
  );
}