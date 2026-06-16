import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// We fetch fonts or just use default Satori fonts.
// To keep it simple, we'll use default Satori sans-serif.

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get('id');

    if (!cardId) {
      return new Response('Missing id', { status: 400 });
    }

    const card = await prisma.tradingCard.findUnique({
      where: { id: cardId },
      include: { player: true }
    });

    if (!card) {
      return new Response('Not found', { status: 404 });
    }

    const rarityColors: Record<string, string> = {
      'MYTHIC': '#dc2626',
      'LEGENDARY': '#facc15',
      'EPIC': '#a855f7',
      'RARE': '#3b82f6',
      'UNCOMMON': '#22c55e',
      'COMMON': '#94a3b8'
    };

    const color = rarityColors[card.rarity] || '#94a3b8';

    // Image URL fallback (crafty render) with cache buster
    const timestamp = Date.now();
    const bgImage = card.imageUrl || `https://render.crafty.gg/3d/bust/${card.player?.minecraftName || 'Steve'}?v=${timestamp}`;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0510',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Card Frame */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 320,
              height: 480,
              backgroundColor: '#1f2937',
              borderRadius: 16,
              border: `6px solid ${color}`,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: `0 0 40px ${color}80`,
            }}
          >
            {/* Background/Illustration */}
            <img
              src={bgImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
            
            {/* Bottom Gradient overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                display: 'flex',
              }}
            />

            {/* Content overlay */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                padding: 20,
              }}
            >
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                  marginBottom: 8,
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  textAlign: 'center',
                }}
              >
                {card.title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  backgroundColor: `${color}40`,
                  border: `2px solid ${color}`,
                  padding: '4px 12px',
                  borderRadius: 20,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                {card.rarity}
              </div>

              {card.level && (
                <div
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: '4px 8px',
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  Niv. {card.level}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 400,
        height: 600,
      }
    );
  } catch (e: any) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
