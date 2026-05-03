'use client'

import { useState } from 'react'
import { Copy, Check, Key, Shield, Clock, AlertTriangle, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PLANOS } from '@/lib/types'

interface KeyDisplayProps {
  keyValue: string
  plano: string
}

export function KeyDisplay({ keyValue, plano }: KeyDisplayProps) {
  const [copied, setCopied] = useState(false)

  const planoConfig = PLANOS.find(p => p.id === plano)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(keyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header de sucesso */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary neon-border">
          <Key className="w-8 h-8 text-primary" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold font-mono text-primary neon-glow">
            PAGAMENTO CONFIRMADO
          </h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Sua key foi gerada com sucesso
          </p>
        </div>
      </div>

      {/* Key Display */}
      <div className="relative p-6 bg-card rounded-lg border border-primary neon-border">
        <div className="absolute -top-3 left-4 px-2 bg-card text-xs font-mono text-primary">
          SUA KEY
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <code className="text-2xl md:text-3xl font-mono font-bold text-primary tracking-wider neon-glow">
            {keyValue}
          </code>
          
          <Button
            onClick={handleCopy}
            variant={copied ? "default" : "outline"}
            size="lg"
            className={cn(
              'gap-2 font-mono',
              copied && 'bg-primary text-primary-foreground'
            )}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                COPIADO
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                COPIAR
              </>
            )}
          </Button>
        </div>

        {/* Info do plano */}
        {planoConfig && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-mono">Plano:</span>
            <span className="font-mono font-bold text-foreground">{planoConfig.nome}</span>
          </div>
        )}
      </div>

      {/* Avisos importantes */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-mono font-bold text-destructive text-sm">IMPORTANTE</h4>
            <p className="text-sm text-muted-foreground font-mono">
              Guarde sua key em um local seguro. Ela sera ativada no primeiro uso.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
            <Smartphone className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h5 className="font-mono text-xs font-bold text-foreground">USO EXCLUSIVO</h5>
              <p className="text-xs text-muted-foreground font-mono">Vinculada ao seu dispositivo</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h5 className="font-mono text-xs font-bold text-foreground">PROTEGIDA</h5>
              <p className="text-xs text-muted-foreground font-mono">Sistema de seguranca ativo</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
            <Clock className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h5 className="font-mono text-xs font-bold text-foreground">VALIDADE</h5>
              <p className="text-xs text-muted-foreground font-mono">{planoConfig?.duracao || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções de uso */}
      <div className="p-4 bg-card rounded-lg border border-border">
        <h3 className="font-mono text-sm text-primary mb-3 flex items-center gap-2">
          <span className="text-neon-green">[</span>
          COMO USAR SUA KEY
          <span className="text-neon-green">]</span>
        </h3>
        
        <ol className="space-y-2 text-sm text-muted-foreground font-mono">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">01.</span>
            <span>Abra o aplicativo NEXUS no seu dispositivo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">02.</span>
            <span>Vá em Configurações {'>'} Ativar Key</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">03.</span>
            <span>Cole ou digite sua key: <code className="text-primary">{keyValue}</code></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">04.</span>
            <span>Clique em Ativar e aguarde a validação</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">05.</span>
            <span>Pronto! Sua key será vinculada a este dispositivo</span>
          </li>
        </ol>
      </div>

      {/* Suporte */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-mono">
          Problemas? Entre em contato pelo suporte
        </p>
      </div>
    </div>
  )
}
