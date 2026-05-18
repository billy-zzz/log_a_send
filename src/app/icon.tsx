import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        backgroundColor: '#f97316',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 14,
          height: 12,
          backgroundColor: 'white',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}
      />
    </div>,
    { width: 32, height: 32 },
  )
}
