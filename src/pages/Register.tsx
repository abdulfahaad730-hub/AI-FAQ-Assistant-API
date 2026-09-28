import React, { useState, useEffect } from 'react';
import { RegistrationNav } from '../components/registration/RegistrationNav';
import { TeamRegistrationForm } from '../components/registration/TeamRegistrationForm';
import { RegistrationTicketModal } from '../components/registration/RegistrationTicketModal';
import { RegistrationSubmission } from '../types';

export const Register: React.FC = () => {
  const [completedSubmission, setCompletedSubmission] = useState<RegistrationSubmission | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative z-10">
      {/* Top Header Bar with College Logo pill */}
      <RegistrationNav />

      {/* Main Registration Form */}
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <TeamRegistrationForm onSuccess={(sub) => setCompletedSubmission(sub)} />
      </main>

      {/* Success Holographic Ticket Modal */}
      {completedSubmission && (
        <RegistrationTicketModal
          submission={completedSubmission}
          onClose={() => setCompletedSubmission(null)}
        />
      )}
    </div>
  );
};
