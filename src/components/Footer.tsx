import React from 'react'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const { Text } = Typography

const FooterContainer = styled.footer`
  background: #000;
  color: #fff;
  padding: 20px;
  margin-top: auto;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`

const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <FooterContainer>
      <FooterContent>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
             <span id="busuanzi_container_site_pv">{t('common.siteVisits')}<span id="busuanzi_value_site_pv">258341</span>{t('common.visitsUnit')}</span>
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', marginLeft: '20px' }}>
             <span>{t('common.copyright')}</span>
          </Text>
        </div>
      </FooterContent>
    </FooterContainer>
  )
}

export default Footer
