'use client'

import { useState } from 'react'
import { PlanSelector } from './plan-selector'
import { PixPayment } from './pix-payment'
import { KeyDisplay } from './key-display'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, ShieldCheck, Zap, Lock, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlanoConfig, CreatePixResponse } from '@/lib/types'

type CheckoutStep = 'select' | 'payment' | 'success'

export function CheckoutFlow() {
  const [step, setStep] = useState<CheckoutStep>('select')
  const [selectedPlan, setSelectedPlan] = useState<PlanoConfig | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Dados do pagamento
  const [paymentData, setPaymentData] = useState<{
    paymentId: string
    qrCode: string | null
    qrCodeBase64: string | null
    pixCopiaCola: string | null
  } | null>(null)
  
  // Key gerada
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  const handleCreatePayment = async () => {
    if (!selectedPlan) {
      setError('Selecione um plano')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planoId: selectedPlan.id,
          email: email || undefined
        })
      })

      const data: CreatePixResponse = await res.json()

      if (!data.success || !data.paymentId) {
        throw new Error(data.error || 'Erro ao criar pagamento')
      }

      setPaymentData({
        paymentId: data.paymentId,
        qrCode: data.qrCode || null,
        qrCodeBase64: data.qrCodeBase64 || null,
        pixCopiaCola: data.pixCopiaCola || null
      })
      
      setStep('payment')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentConfirmed = (key: string) => {
    setGeneratedKey(key)
    setStep('success')
  }

  const formatPrice = (centavos: number) => {
    return (centavos / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <Terminal className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold font-mono text-primary neon-glow">
            NEXUS KEY
          </h1>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono">
          <span className={cn(
            'px-2 py-1 rounded',
            step === 'select' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            1. PLANO
          </span>
          <span className="text-muted-foreground">{'>'}</span>
          <span className={cn(
            'px-2 py-1 rounded',
            step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            2. PAGAMENTO
          </span>
          <span className="text-muted-foreground">{'>'}</span>
          <span className={cn(
            'px-2 py-1 rounded',
            step === 'success' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            3. KEY
          </span>
        </div>
      </div>

      {/* Step: Select Plan */}
      {step === 'select' && (
        <div className="space-y-6">
          <PlanSelector 
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
          />

          {/* Email (opcional) */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-muted-foreground">
              Email (opcional - para receber comprovante):
            </label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-mono bg-card border-border focus:border-primary"
            />
          </div>

          {/* Erro */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm font-mono">
              {error}
            </div>
          )}

          {/* Botão de pagamento */}
          <Button
            onClick={handleCreatePayment}
            disabled={!selectedPlan || loading}
            className="w-full h-14 text-lg font-mono font-bold gap-2 neon-box"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                GERANDO PIX...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                PAGAR {selectedPlan ? formatPrice(selectedPlan.preco) : ''} COM PIX
              </>
            )}
          </Button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="text-center">
              <ShieldCheck className="w-6 h-6 mx-auto text-primary mb-1" />
              <span className="text-xs font-mono text-muted-foreground">100% Seguro</span>
            </div>
            <div className="text-center">
              <Zap className="w-6 h-6 mx-auto text-primary mb-1" />
              <span className="text-xs font-mono text-muted-foreground">Ativacao Rapida</span>
            </div>
            <div className="text-center">
              <Lock className="w-6 h-6 mx-auto text-primary mb-1" />
              <span className="text-xs font-mono text-muted-foreground">Protegido</span>
            </div>
          </div>
        </div>
      )}

      {/* Step: Payment */}
      {step === 'payment' && paymentData && (
        <PixPayment
          qrCode={paymentData.qrCode}
          qrCodeBase64={paymentData.qrCodeBase64}
          pixCopiaCola={paymentData.pixCopiaCola}
          paymentId={paymentData.paymentId}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}

      {/* Step: Success */}
      {step === 'success' && generatedKey && selectedPlan && (
        <KeyDisplay
          keyValue={generatedKey}
          plano={selectedPlan.id}
        />
      )}
    </div>
  )
}
