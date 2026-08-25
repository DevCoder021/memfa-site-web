"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Heart, ShieldCheck, Copy, Check, ArrowLeft, Smartphone, ChevronRight, CreditCard } from "lucide-react";
import Link from "next/link";

export default function GivePage() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation d'entrée
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".apple-card", 
        { opacity: 0, y: 30, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(".fade-in-up", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, stagger: 0.1, delay: 0.2, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleValidate = () => {
    if (!amount || !selectedMethod) return;
    
    setIsProcessing(true);
    // Simulation d'un délai de traitement
    setTimeout(() => {
      alert(`Don de ${amount} FCFA via ${selectedMethod === 'wave' ? 'Wave' : selectedMethod === 'orange' ? 'Orange Money' : selectedMethod === 'moov' ? 'Moov Africa' : 'MTN MoMo'} initié !`);
      setIsProcessing(false);
      // Ici, vous redirigeriez vers une page de confirmation ou ouvririez une modale
    }, 1500);
  };

  const quickAmounts = [5000, 10000, 25000, 50000];

  const paymentMethods = [
    {
      id: "wave",
      name: "Wave CI",
      number: "07 00 00 00 00",
      bg: "bg-[#4ad2fa]",
      logo: "/assets/wave.png",
    },
    {
      id: "orange",
      name: "Orange Money",
      number: "07 01 01 01 01",
      bg: "bg-[#fff]",
      logo: "/assets/orange.png",
    },
    {
      id: "moov",
      name: "Moov Africa",
      number: "01 02 02 02 02",
      bg: "bg-[#0066b3]",
      logo: "/assets/moov.png",
    },
    {
      id: "mtn",
      name: "MTN MoMo",
      number: "07 02 02 02 02",
      bg: "bg-[#ffcc00]",
      logo: "/assets/mtn.png",
    },
  ];

  // Vérification si le formulaire est valide pour activer le bouton
  const isFormValid = amount && parseInt(amount) > 0 && selectedMethod;

  return (
    <div className="min-h-screen bg-[var(--color-memfa-violet-soft)] text-[var(--color-memfa-charcoal)] selection:bg-[var(--color-memfa-or-soft)]">
      
      {/* Fond subtil */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[var(--color-memfa-violet)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--color-memfa-or)]/10 rounded-full blur-[120px]" />
      </div>

      <main ref={containerRef} className="relative z-10 pt-24 pb-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-10 fade-in-up">
            <Link href="/" className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1a0f2b] transition-colors">
              <div className="p-2 rounded-full bg-white border border-gray-200 group-hover:border-gray-300 shadow-sm">
                <ArrowLeft size={16} strokeWidth={2.5} />
              </div>
              <span>Retour</span>
            </Link>
            <div className="flex items-center gap-2 text-[#1a0f2b]">
              <Heart size={18} fill="currentColor" className="text-[#d97706]" />
              <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Donation</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* COLONNE GAUCHE : Montant */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(26,15,43,0.08)] border border-white/50 p-8 apple-card relative overflow-hidden">
                
                <div className="mb-8 fade-in-up">
                  <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-memfa-violet-deep)] mb-1">Votre Don</h1>
                  <p className="text-gray-500 text-sm">Soutenez l&apos;œuvre de la mission.</p>
                </div>

                <div className="mb-8 fade-in-up">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Montant</label>
                  <div className={`relative bg-[#F5F5F7] rounded-3xl p-6 transition-all duration-300 ${selectedMethod ? 'ring-2 ring-[#1a0f2b]/10 bg-white shadow-lg' : ''}`}>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full text-6xl font-semibold text-[#1a0f2b] bg-transparent outline-none placeholder:text-gray-300 tracking-tight"
                    />
                    <div className="absolute right-6 bottom-6 flex flex-col items-end">
                      <span className="text-lg font-semibold text-[var(--color-memfa-or)]">FCFA</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* COLONNE DROITE : Sélection Paiement & Validation */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(26,15,43,0.08)] border border-white/50 p-8 apple-card">
                
                <div className="flex items-center justify-between mb-8 fade-in-up">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#1a0f2b]">Paiement Mobile</h2>
                    <p className="text-gray-500 text-sm mt-1">Sélectionnez votre opérateur.</p>
                  </div>
                  <div className="w-10 h-10 bg-[#F5F5F7] rounded-full flex items-center justify-center text-[#1a0f2b]">
                    <Smartphone size={20} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {paymentMethods.map((method, index) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <div 
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`cursor-pointer group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 fade-in-up ${
                          isSelected 
                            ? 'border-[#1a0f2b] bg-white shadow-xl scale-[1.02]' 
                            : 'border-transparent bg-[#F5F5F7] hover:bg-white hover:shadow-lg hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${method.bg} rounded-full flex items-center justify-center shadow-sm transition-transform ${isSelected ? 'scale-110' : ''}`}>
                            <img
                              src={method.logo}
                              alt={`${method.name} logo`}
                              className={`object-contain ${method.id === 'wave' ? 'w-8 h-8' : 'w-10 h-10'}`}
                            />
                          </div>
                          
                          <div>
                            <p className={`text-base font-semibold transition-colors ${isSelected ? 'text-[#1a0f2b]' : 'text-gray-700'}`}>{method.name}</p>
                            <p className="text-sm font-mono text-gray-500 tracking-wide">{method.number}</p>
                          </div>
                        </div>

                        {/* Indicateur de sélection (Radio Button style) */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#1a0f2b] bg-[#1a0f2b]' : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Zone d'action rapide pour copier le numéro si besoin */}
                {selectedMethod && (
                  <div className="bg-[#F5F5F7] rounded-xl p-4 flex items-center justify-between fade-in-up">
                    <span className="text-xs font-bold text-gray-500 uppercase">Numéro à utiliser :</span>
                    <button 
                      onClick={() => copyToClipboard(
                        paymentMethods.find(m => m.id === selectedMethod)?.number || "", 
                        "main"
                      )}
                      className="text-xs font-bold text-[#1a0f2b] flex items-center gap-1 hover:text-[#d97706] transition-colors"
                    >
                      {copied === "main" ? <Check size={14} /> : <Copy size={14} />}
                      {copied === "main" ? "Copié !" : "Copier le numéro"}
                    </button>
                  </div>
                )}

              </div>

              {/* Carte d'aide */}
              <div className="bg-[#1a0f2b] rounded-2xl p-5 text-white flex items-start gap-4 shadow-xl shadow-purple-900/20 fade-in-up">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md shrink-0">
                  <ChevronRight size={20} className="text-[#d97706]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-0.5">Assistance Transfert</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Un souci ? Appelez le <strong className="text-white">+225 00 00 00 00</strong>.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* BARRE FLOTTANTE DE VALIDATION (Style Apple Pay / Bottom Sheet) */}
        <div className={`fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-200 p-4 sm:p-6 transition-transform duration-500 z-50 ${
          isFormValid ? 'translate-y-0' : 'translate-y-[120%]'
        }`}>
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 uppercase font-bold">Total à payer</p>
              <p className="text-2xl font-bold text-[#1a0f2b]">{parseInt(amount).toLocaleString()} <span className="text-sm text-[#d97706]">FCFA</span></p>
            </div>
            
            <button 
              onClick={handleValidate}
              disabled={isProcessing}
              className="flex-1 sm:flex-none bg-[#1a0f2b] hover:bg-[#2d1b4e] text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl shadow-purple-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  Valider le Don
                  <ChevronRight size={24} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}