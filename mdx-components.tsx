import Link from "next/link"
import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef } from "react"

// Links internos do MDX usam next/link (navegação sem recarregar a página).
function MdxLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) return <Link href={href} {...props} />
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
}

function MdxTable(props: ComponentPropsWithoutRef<"table">) {
  return (
    // tabIndex + role: a tabela rola na horizontal no celular, então precisa ser alcançável pelo teclado
    <div className="not-prose my-6 overflow-x-auto rounded-xl border" tabIndex={0} role="region" aria-label="Tabela (role para o lado para ver tudo)">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm [&_td]:border-t [&_td]:px-4 [&_td]:py-2.5 [&_th]:bg-surface [&_th]:px-4 [&_th]:py-2.5 [&_th]:font-semibold" {...props} />
    </div>
  )
}

const components: MDXComponents = {
  a: MdxLink,
  table: MdxTable,
}

export function useMDXComponents(): MDXComponents {
  return components
}
