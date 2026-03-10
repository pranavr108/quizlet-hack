import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

type CardContentProps = {
  readonly text: string
}

export const CardContent = ({ text }: CardContentProps) => (
  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
    {text}
  </ReactMarkdown>
)
