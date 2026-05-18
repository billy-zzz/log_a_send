type Level = 'INFO' | 'WARN' | 'ERROR'

export function log(level: Level, message: string, data?: Record<string, unknown>): void {
  console.log(JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...data }))
}
