export const ParagraphStatus = {
  READY: 'READY',
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  FINISHED: 'FINISHED',
  ABORT: 'ABORT',
  ERROR: 'ERROR',
}

export function isParagraphRunning (paragraph) {
  if (!paragraph) return false
  const status = paragraph.status
  if (!status) return false
  return status === ParagraphStatus.PENDING || status === ParagraphStatus.RUNNING
}
