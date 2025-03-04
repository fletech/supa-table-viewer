
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Login = () => {
  const { signInWithGoogle, isLoading } = useAuth();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setIsLoginLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Error during sign in:', error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-tr from-background to-primary/5 px-4 sm:px-6">
      <div className="animate-fade-in w-full max-w-md">
        <Card className="border-border/40 shadow-xl">
          <CardHeader className="pb-6 pt-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Table className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">WhApplied?</CardTitle>
            <CardDescription className="pt-1">
              Track your job applications efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid gap-6">
              <Button
                variant="outline"
                className="gap-2 bg-card shadow-none hover:bg-accent"
                onClick={handleSignIn}
                disabled={isLoginLoading}
              >
                {isLoginLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Sign in with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-6 pb-6 pt-0 text-center text-xs text-muted-foreground">
            <p>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
