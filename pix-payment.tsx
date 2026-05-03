'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, QrCode, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PixPaymentProps {
  qrCode: string | null
  qrCodeBase64: string | null
  pixCopiaCola: string | null
  paymentId: string
  onPaymentConfirmed: (key: string) => void
}

export function PixPayment({ 
  qrCode, 
  qrCodeBase64, 
  pixCopiaCola, 
  paymentId,
  onPaymentConfirmed 
}: PixPaymentProps) {
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutos em segundos
  const [error, setError] = useState<string | null>(null)

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Polling para verificar status do pagamento
  useEffect(() => {
    const checkStatus = async () => {
      if (checking) return
      
      try {
        setChecking(true)
        const res = await fetch(`/api/pix/status?paymentId=${paymentId}`)
        const data = await res.json()
        
        if (data.status === 'approved' && data.key) {
          onPaymentConfirmed(data.key)
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err)
      } finally {
        setChecking(false)
      }
    }

    // Verifica a cada 5 segundos
    const interval = setInterval(checkStatus, 5000)
    
    // Verifica imediatamente na primeira vez
    checkStatus()

    return () => clearInterval(interval)
  }, [paymentId, onPaymentConfirmed, checking])

  const handleCopy = async () => {
    if (!pixCopiaCola) return
    
    try {
      await navigator.clipboard.writeText(pixCopiaCola)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('Erro ao copiar. Tente selecionar manualmente.')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isExpired = timeLeft <= 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/30">
          <QrCode className="w-5 h-5 text-primary" />
          <span className="font-mono text-primary">PAGAMENTO PIX</span>
        </div>
        
        {/* Timer */}
        <div className={cn(
          'flex items-center justify-center gap-2 font-mono text-sm',
          isExpired ? 'text-destructive' : 'text-muted-foreground'
        )}>
          <Clock className="w-4 h-4" />
          {isExpired ? (
            <span>QR Code expirado</span>
          ) : (
            <span>Expira em {formatTime(timeLeft)}</span>
          )}
        </div>
      </div>

      {/* QR Code */}
      {qrCodeBase64 && !isExpired && (
        <div className="flex justify-center">
          <div className="relative p-4 bg-white rounded-lg neon-border">
            <img 
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code PIX"
              className="w-48 h-48"
            />
            {checking && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Código Copia e Cola */}
      {pixCopiaCola && !isExpired && (
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">
            PIX Copia e Cola:
          </label>
          <div className="relative">
            <div className="p-3 bg-card rounded-lg border border-border font-mono text-xs break-all max-h-24 overflow-y-auto">
              {pixCopiaCola}
            </div>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className={cn(
                'absolute top-2 right-2 gap-1',
                copied && 'bg-primary text-primary-foreground'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Status de verificação */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-mono">Aguardando confirmação do pagamento...</span>
      </div>

      {/* Erro */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Instruções */}
      <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="font-mono text-sm text-primary">Como pagar:</h3>
        <ol className="text-sm text-muted-foreground space-y-1 font-mono">
          <li>1. Abra o app do seu banco</li>
          <li>2. Escolha pagar com PIX</li>
          <li>3. Escaneie o QR Code ou cole o código</li>
          <li>4. Confirme o pagamento</li>
          <li>5. Sua key será liberada automaticamente</li>
        </ol>
      </div>
    </div>
  )
}
