import { ImageResponse } from 'next/og'

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: 192,
        height: 192,
        borderRadius: 40,
        backgroundColor: '#f97316',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 86,
          height: 74,
          backgroundColor: 'white',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}
      />
    </div>,
    { width: 192, height: 192 },
  )
}
