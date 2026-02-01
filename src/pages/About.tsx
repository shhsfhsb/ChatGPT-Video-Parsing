import React, { useState } from 'react'
import { Card, Row, Col, Typography, Modal } from 'antd'
import {
  GithubOutlined,
  MailOutlined,
  WechatOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { meImage, payImage, wxImage } from '@/utils/images'

const { Title, Paragraph } = Typography

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 200px);
`

const SectionTitle = styled.h2`
  margin-bottom: 40px;
  text-align: center;
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const AboutCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .ant-card-head {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 16px 16px 0 0;
  }
`

const ProfileCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;

  .profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 2.5rem;
  }
`

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 20px 0;
  font-size: 1.5rem;

  a {
    color: #667eea;
    transition: all 0.3s ease;

    &:hover {
      color: #764ba2;
      transform: translateY(-2px);
    }
  }
`

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;

  .tech-tag {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
  }
`

const WeChatIcon = styled.span`
  cursor: pointer;
  color: #667eea;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #764ba2;
    transform: translateY(-2px);
  }
`

const ModalContent = styled.div`
  text-align: center;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
`

const CarouselSlide = styled.div<{ isVisible: boolean; slideDirection: 'left' | 'right' }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  width: 100%;
  flex-direction: column;
  align-items: center;
  animation: slide${props => props.slideDirection === 'left' ? 'Left' : 'Right'} 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideLeft {
    from {
      opacity: 0;
      transform: translateX(50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes slideRight {
    from {
      opacity: 0;
      transform: translateX(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
`

const QRImage = styled.img`
  width: 100%;
  max-width: 280px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`

const SlideTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  letter-spacing: 1px;
`

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  z-index: 10;

  &:hover {
    transform: translateY(-50%) scale(1.15);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: translateY(-50%) scale(1.05);
  }

  &.prev {
    left: -30px;
  }

  &.next {
    right: -30px;
  }
`


const About: React.FC = () => {
  const { t } = useTranslation()
  const technologies = ['Vue', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'Java', 'Kotlin', 'Python', 'MySQL', 'Docker', 'Nginx']

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')

  const slides = [
    { image: payImage, title: t('about.supportMe') },
    { image: wxImage, title: t('about.addMe') }
  ]

  const handlePrevSlide = () => {
    setSlideDirection('right')
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const handleNextSlide = () => {
    setSlideDirection('left')
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <PageContainer>
      <SectionTitle>{t('about.title')}</SectionTitle>
      <Row gutter={[24, 24]} style={{ alignItems: 'center' }}>
        <Col xs={24} md={8}>
          <ProfileCard>
            <div className="profile-avatar">
              <img
                src={meImage}
                alt="My Logo"
                style={{ width: '80px', height: '80px', borderRadius: '50%' }}
              />
            </div>
            <Title level={4} style={{ marginBottom: '8px' }}>
              {t('about.name')}
            </Title>
            <Paragraph style={{ color: '#64748b', marginBottom: '24px' }}>
              {t('about.description')}
            </Paragraph>
            <SocialLinks>
              <a href="https://github.com/P1kaj1uu" target="_blank" rel="noopener noreferrer">
                <GithubOutlined />
              </a>
              <a href="mailto:891523233@qq.com">
                <MailOutlined />
              </a>
              <WeChatIcon onClick={() => setIsModalVisible(true)}>
                <WechatOutlined />
              </WeChatIcon>
            </SocialLinks>
            <TechList>
              {technologies.map((tech, index) => (
                <span key={index} className="tech-tag">
                  {tech}
                </span>
              ))}
            </TechList>
          </ProfileCard>
        </Col>
        <Col xs={24} md={16}>
          <AboutCard>
            <Card.Meta
              title={t('about.contact')}
              description={
                <div>
                  <ul style={{ paddingLeft: '24px', color: '#64748b' }}>
                    <li style={{ marginBottom: '0px' }}>{t('about.wechat')}</li>
                  </ul>
                  <Title level={5} style={{ marginBottom: '16px' }}>
                    {t('about.internship')}
                  </Title>
                  <ul style={{ paddingLeft: '24px', color: '#64748b' }}>
                    <li style={{ marginBottom: '8px' }}>{t('about.internship1')}</li>
                    <li style={{ marginBottom: '0px' }}>{t('about.internship2')}</li>
                  </ul>
                  <Title level={5} style={{ marginBottom: '16px' }}>
                    {t('about.awards')}
                  </Title>
                  <ul style={{ paddingLeft: '24px', color: '#64748b' }}>
                    <li style={{ marginBottom: '8px' }}>{t('about.award1')}</li>
                    <li style={{ marginBottom: '8px' }}>{t('about.award2')}</li>
                    <li style={{ marginBottom: '8px' }}>{t('about.award3')}</li>
                    <li style={{ marginBottom: '8px' }}>{t('about.award4')}</li>
                    <li style={{ marginBottom: '8px' }}>{t('about.award5')}</li>
                    <li style={{ marginBottom: '8px' }}>{t('about.award6')}</li>
                    <li style={{ marginBottom: '8px' }}>{t('about.award7')}</li>
                    <li style={{ marginBottom: '8px' }}>{t('about.award8')}</li>
                    <li style={{ marginBottom: '0px' }}>{t('about.award9')}</li>
                  </ul>
                </div>
              }
            />
          </AboutCard>
        </Col>
      </Row>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
        centered
      >
        <ModalContent>
          <CarouselContainer>
            <NavigationButton className="prev" onClick={handlePrevSlide}>
              ‹
            </NavigationButton>
            <NavigationButton className="next" onClick={handleNextSlide}>
              ›
            </NavigationButton>

            {slides.map((slide, index) => (
              <CarouselSlide key={index} isVisible={index === currentSlide} slideDirection={slideDirection}>
                <SlideTitle>{slide.title}</SlideTitle>
                <QRImage src={slide.image} alt={slide.title} />
              </CarouselSlide>
            ))}
          </CarouselContainer>
        </ModalContent>
      </Modal>
    </PageContainer>
  )
}

export default About
