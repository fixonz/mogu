import { GambaTransaction } from 'gamba-core-v2'
import { GambaUi, TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Flex } from '../../components'
import { Modal } from '../../components/Modal'
import { EXPLORER_URL, PLATFORM_SHARABLE_URL } from '../../constants'
import { extractMetadata } from '../../utils'

// Container for the modal content
const Container = styled.div`
  display: grid;
  gap: 10px;
  padding: 20px;
  padding-bottom: 0;
  width: 100%;
`

// Wrapper for inner content
const Inner = styled.div`
  overflow: hidden;
`

// Styled content box with MOGE-themed gradient
const Content = styled.div`
  border-radius: 10px;
  padding: 20px;
  background: linear-gradient(156deg, #444c75, #121217); // MOGE custom gradient colors
`

// Custom button styles
const CustomButton = styled(GambaUi.Button)`
  background-color: #ff7f50;
  border: none;
  color: white;
  &:hover {
    background-color: #ff8c66;
  }
`

// ShareModal component function
export function ShareModal({ event, onClose }: { event: GambaTransaction<'GameSettled'>, onClose: () => void }) {
  const navigate = useNavigate()
  const { game } = extractMetadata(event)
  const gotoGame = () => {
    navigate('/' + game?.id)
    onClose()
  }
  const tokenMeta = useTokenMeta(event.data.tokenMint)
  const ref = React.useRef<HTMLDivElement>(null!)

  // Calculate profit and percentage change
  const profit = event.data.payout.sub(event.data.wager).toNumber()
  const percentChange = profit / event.data.wager.toNumber()

  return (
    <Modal onClose={onClose}>
      <Container>
        <Inner>
          <Content ref={ref}>
            {/* Display token image, profit, multiplier, and game image */}
            <div style={{ display: 'grid', gap: '5px', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', padding: '10px' }}>
              <img src={tokenMeta.image} alt="token" style={{ borderRadius: '50%', height: '40px' }} />
              <div style={{ fontSize: '24px', color: percentChange >= 0 ? '#9bffad' : '#ff4f4f', padding: '10px' }}>
                <b>
                  {profit >= 0 ? '+' : '-'}
                  <TokenValue exact amount={Math.abs(profit)} mint={event.data.tokenMint} />
                </b>
                <div style={{ fontSize: '18px' }}>
                  {(event.data.multiplierBps / 10_000).toLocaleString()}x
                </div>
              </div>
              <div style={{ padding: '10px', textAlign: 'center' }}>
                <img src={game?.meta?.image} alt={game?.meta?.name} width="100px" />
              </div>
            </div>

            {/* Custom branding section */}
            <div style={{ background: '#2d2d44', color: '#ffffffcc', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px' }}>
              <img src="/images/moge-logo.svg" alt="MOGE logo" height="25px" /> {/* Replace with MOGE logo */}
              <div>Play on <b>{PLATFORM_SHARABLE_URL}</b></div>
            </div>
          </Content>
        </Inner>

        {/* Button actions for Verify and Play */}
        <Flex>
          <CustomButton size="small" onClick={() => window.open(`${EXPLORER_URL}/tx/${event.signature}`, '_blank')}>
            Verify
          </CustomButton>
          <CustomButton size="small" onClick={gotoGame}>
            Play {game?.meta?.name}
          </CustomButton>
        </Flex>
      </Container>
    </Modal>
  )
}
