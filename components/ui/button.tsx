import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Tamanhos maiores que o padrão do shadcn: a maior parte do tráfego vem do
// celular, e alvos de toque precisam de pelo menos 44px nas ações principais.
// Movimento: só transform anima (aperto em 0,97 por 150 ms); cores trocam na hora.
// O ripple vem do <RippleRoot> (delegação global pela classe group/button).
const baseButtonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-transform duration-150 ease-(--ease-out) outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none aria-busy:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-brand-hover",
        cta: "bg-cta text-cta-foreground shadow-soft hover:bg-cta-hover",
        outline:
          "border-border bg-background text-foreground hover:border-brand-ink/40 hover:bg-brand-soft hover:text-brand-soft-ink aria-expanded:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        inverse: "bg-white text-navy hover:bg-white/90",
        "outline-inverse": "border-white/30 bg-transparent text-white hover:bg-white/10",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "h-auto px-0 text-brand-ink underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 text-sm",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-12 px-5 text-base",
        xl: "h-14 px-6 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "size-11",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

/**
 * Classes do botão já com tailwind-merge: permite `className="hidden lg:inline-flex"`
 * em links que usam o visual de botão (sem merge, o `inline-flex` base venceria).
 */
const buttonVariants = (props?: Parameters<typeof baseButtonVariants>[0]) => cn(baseButtonVariants(props))

/**
 * `loading`: mostra um spinner por cima sem mudar a largura (o conteúdo fica
 * invisível no lugar) e bloqueia novos cliques. `loadingLabel` é o que o leitor
 * de tela ouve enquanto carrega.
 */
function Button({
  className,
  variant = "default",
  size = "default",
  loading,
  loadingLabel = "Carregando…",
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof baseButtonVariants> & { loading?: boolean; loadingLabel?: string; children?: React.ReactNode }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading === undefined ? (
        children
      ) : (
        <>
          <span className={cn("inline-flex items-center justify-center gap-2", loading && "opacity-0")}>{children}</span>
          {loading && (
            <span className="absolute inset-0 grid place-items-center">
              <Loader2 className="animate-spin" aria-hidden />
              <span className="sr-only" role="status">
                {loadingLabel}
              </span>
            </span>
          )}
        </>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
