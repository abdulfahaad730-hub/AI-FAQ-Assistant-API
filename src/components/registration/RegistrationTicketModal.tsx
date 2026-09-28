import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { CheckCircle2, Printer, Home, QrCode } from 'lucide-react';
import { RegistrationSubmission } from '../../types';
import { CyberButton } from '../common/CyberButton';
import { useHackathon } from '../../context/HackathonContext';

interface RegistrationTicketModalProps {
  submission: RegistrationSubmission;
  onClose: () => void;
}

export const RegistrationTicketModal: React.FC<RegistrationTicketModalProps> = ({ submission }) => {
  const { config } = useHackathon();

  useEffect(() => {
    // Fire festive cyber confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00D9FF', '#7C3AED', '#38BDF8', '#F8FAFC']
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative max-w-xl w-full my-8">
        {/* Holographic Border */}
        <div className="rounded-3xl p-1 bg-gradient-to-b from-cyan-400 via-sky-500 to-purple-600 shadow-[0_0_50px_rgba(0,217,255,0.4)]">
          <div className="rounded-[22px] bg-[#060b17] p-6 sm:p-8 text-white relative overflow-hidden">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                <CheckCircle2 className="w-9 h-9 text-cyan-400" />
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                REGISTRATION SUBMITTED
              </span>

              <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight mt-2">
                Team Pass Generated!
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Your team registration for {config.name} has been recorded.
              </p>
            </div>

            {/* Cyber Ticket Card */}
            <div className="rounded-2xl bg-slate-950/90 border border-cyan-500/30 p-5 sm:p-6 mb-6 relative overflow-hidden">
              {/* Top ticket bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/college-logo.png"
                    alt="College Logo"
                    className="w-8 h-8 object-contain rounded-full bg-white p-0.5"
                  />
                  <div>
                    <h4 className="text-xs font-display font-black text-white uppercase">
                      {config.collegeName}
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {config.name} // PASS
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    REG ID
                  </span>
                  <span className="text-sm font-mono font-black text-cyan-400">
                    {submission.id}
                  </span>
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4">
                <div>
                  <span className="text-slate-500 block text-[10px]">TEAM NAME:</span>
                  <span className="font-bold text-white text-sm truncate block">{submission.teamName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">TEAM LEADER:</span>
                  <span className="font-bold text-white text-sm truncate block">{submission.leaderName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">DOMAIN:</span>
                  <span className="text-cyan-300 truncate block">{submission.domainName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">TOTAL SQUAD SIZE:</span>
                  <span className="text-white">{submission.teamSize} Members</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">FEE PAID:</span>
                  <span className="text-emerald-400 font-bold">₹{submission.totalFee}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">TRANSACTION ID:</span>
                  <span className="text-slate-300 truncate block">{submission.transactionId}</span>
                </div>
              </div>

              {/* QR Verification Box */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Valid for Phase 1 Idea Screening</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  ● Status: Pending Verification
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <CyberButton
                onClick={handlePrint}
                variant="secondary"
                size="md"
                leftIcon={<Printer className="w-4 h-4" />}
                className="w-full sm:w-1/2 text-xs"
              >
                Print / Save Pass
              </CyberButton>

              <Link to="/" className="w-full sm:w-1/2">
                <CyberButton
                  variant="primary"
                  size="md"
                  leftIcon={<Home className="w-4 h-4" />}
                  className="w-full text-xs"
                >
                  Return to Home
                </CyberButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
