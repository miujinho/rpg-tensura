type BlogPost = {
  slug: string
  metadata: {
    title: string
    publishedAt: string
  }
}

export function getBlogPosts(): BlogPost[] {
  // Minimal implementation: return empty list so components depending on blog work.
  return []
}

export function formatDate(d: string | Date, showYear = true) {
  try {
    const date = typeof d === 'string' ? new Date(d) : d
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' }
    if (showYear) opts.year = 'numeric'
    return new Intl.DateTimeFormat('en-US', opts).format(date)
  } catch (e) {
    return ''
  }
}
