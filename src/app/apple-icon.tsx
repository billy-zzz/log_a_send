import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        backgroundColor: '#f97316',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 80,
          height: 68,
          backgroundColor: 'white',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}
      />
    </div>,
    { width: 180, height: 180 },
  )
}
