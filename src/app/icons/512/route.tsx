import { ImageResponse } from 'next/og'

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: 512,
        height: 512,
        borderRadius: 106,
        backgroundColor: '#f97316',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 230,
          height: 196,
          backgroundColor: 'white',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}
      />
    </div>,
    { width: 512, height: 512 },
  )
}
