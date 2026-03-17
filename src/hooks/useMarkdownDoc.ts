import { computed } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

export const useMarkdownDoc = (rawMarkdown: string) => {
  const docHtml = computed(() => {
    const parsedMarkdown = marked.parse(rawMarkdown) as string
    return DOMPurify.sanitize(parsedMarkdown)
  })

  return {
    docHtml
  }
}
