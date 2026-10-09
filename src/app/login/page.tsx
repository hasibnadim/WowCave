"use client";

import { initializeUI } from '@firebase-oss/ui-core';
import { FirebaseUIProvider, OAuthScreen } from '@firebase-oss/ui-react';
import { fbApp } from "@/lib/firebase/client";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { SignInAuthForm } from '@/components/sign-in-auth-form';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { UserCredential } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
const ui = initializeUI({
  app: fbApp,
});

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredential, error, clearError, status } = useAuth();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/');
  }, [router, status]);

  async function onLoginEvent(cred: UserCredential) {
    clearError();
    await loginWithCredential(await cred.user.getIdToken());
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10 p-6">
      <CardContent>
        {error ? <p role="alert" className="mb-4 text-sm text-destructive">{error}</p> : null}
        <FirebaseUIProvider ui={ui} >
          <OAuthScreen >
            <SignInAuthForm onSignIn={onLoginEvent} />
            <Separator className="my-4" />
            <GoogleSignInButton onSignIn={onLoginEvent} />
          </OAuthScreen>
        </FirebaseUIProvider>
      </CardContent>
    </Card>
  );
}