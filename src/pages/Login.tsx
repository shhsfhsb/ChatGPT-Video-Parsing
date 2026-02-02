import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox, message, Space } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  KeyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import VerifyCode from '../components/VerifyCode'
import HeartBeat from '../components/HeartBeat'
import { logoImage } from '@/utils/images'
import { setToken } from '@/utils/token'

// 创建气泡组件
const Bubble = styled.div<{ size: number; left: number; delay: number; popped: boolean }>`
  position: absolute;
  bottom: -100px;
  left: ${props => props.left}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3));
  border-radius: 50%;
  animation: rise ${props => 4 + props.delay}s ease-in infinite;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  ${props => props.popped && `
    animation: none;
    transform: scale(0);
    opacity: 0;
  `}

  @keyframes rise {
    0% {
      bottom: -100px;
      opacity: 0;
      transform: translateX(0) scale(1);
    }
    10% {
      opacity: 0.8;
    }
    90% {
      opacity: 0.8;
      transform: translateX(${props => Math.sin(props.delay * 10) * 30}px) scale(1);
    }
    100% {
      bottom: 100vh;
      opacity: 0;
      transform: translateX(${props => Math.sin(props.delay * 10) * 50}px) scale(1.2);
    }
  }

  /* 气泡光泽效果 */
  &::after {
    content: '';
    position: absolute;
    top: 15%;
    left: 20%;
    width: 30%;
    height: 30%;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    filter: blur(2px);
  }
`

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #667eea);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  position: relative;
  overflow: hidden;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* 动态光晕效果 */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: moveBackground 30s linear infinite;
  }

  @keyframes moveBackground {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(60px, 60px) rotate(360deg); }
  }
`

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  position: relative;
  z-index: 1;
  padding: 32px;
  animation: boxAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes boxAppear {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 24px;
  }
`

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 12px;
    animation: logoAnimation 3s ease-in-out infinite;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  @keyframes logoAnimation {
    0%, 100% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(1.05);
    }
  }

  h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.1em;
  }
`

const Login: React.FC = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [verifyCode, setVerifyCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAgreed, setIsAgreed] = useState(true)
  const [showHeartBeat, setShowHeartBeat] = useState(false)
  const navigate = useNavigate()
  const [bubbles, setBubbles] = useState(() =>
    Array.from({ length: 15 }, () => ({
      size: Math.random() * 30 + 10,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      popped: false
    }))
  )

  useEffect(() => {
    generateVerifyCode()

    // 气泡破裂效果
    const popBubbles = setInterval(() => {
      setBubbles(prev => {
        const popIndex = Math.floor(Math.random() * prev.length)
        const newBubbles = [...prev]

        // 破裂动画
        newBubbles[popIndex] = { ...newBubbles[popIndex], popped: true }

        // 重新生成该气泡
        setTimeout(() => {
          setBubbles(current => {
            const reset = [...current]
            reset[popIndex] = {
              size: Math.random() * 30 + 10,
              left: Math.random() * 100,
              delay: Math.random() * 3,
              popped: false
            }
            return reset
          })
        }, 100)

        return newBubbles
      })
    }, 2000)

    return () => clearInterval(popBubbles)
  }, [])

  const generateVerifyCode = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setVerifyCode(code)
  }

  const handleLogin = async (values: any) => {
    const isCodeValid = values.code?.toUpperCase() === verifyCode.toUpperCase()

    if (!isCodeValid) {
      message.error(t('login.verifyCodeError'))
      generateVerifyCode()
      form.setFieldsValue({ code: '' })
      return
    }

    if (!isAgreed) {
      message.error(t('login.agreeRequired'))
      return
    }

    setLoading(true)
    try {
      // 模拟登录过程
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 保存登录状态和 token
      setToken()
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', values.username)

      message.success(t('login.loginSuccess'))
      // 显示心跳动画
      setShowHeartBeat(true)
    } catch (error) {
      message.error(t('login.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    // 游客登录也保存状态和 token
    setToken()
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('username', '游客')
    message.success(t('login.guestLoginSuccess'))
    // 游客访问不显示心跳动画，直接跳转到首页
    setShowHeartBeat(false)
    handleHeartBeatComplete()
  }

  const handleHeartBeatComplete = () => {
    navigate('/home')
  }

  const handleForgetPassword = () => {
    message.info(t('login.forgetPasswordTip'))
  }

  const handleRegister = () => {
    message.info(t('login.registerTip'))
  }

  const handleReset = () => {
    form.resetFields()
  }

  return (
    <>
      {showHeartBeat ? (
        <HeartBeat onComplete={handleHeartBeatComplete} />
      ) : (
        <LoginContainer>
          {bubbles.map((bubble, index) => (
            <Bubble
              key={index}
              size={bubble.size}
              left={bubble.left}
              delay={bubble.delay}
              popped={bubble.popped}
            />
          ))}

          <LoginBox>
        <Logo>
          <img src={logoImage} alt="Logo" />
          <h3>ChattyPlay</h3>
        </Logo>

        <Form
          form={form}
          onFinish={handleLogin}
          layout="vertical"
          initialValues={{
            username: 'P1Kaj1uu',
            password: 'OwaGDragon'
          }}
        >
          <Form.Item
            name="username"
            label={t('login.account')}
            rules={[{ required: true, message: t('login.accountRequired') }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('login.accountPlaceholder')}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('login.password')}
            rules={[
              { required: true, message: t('login.passwordRequired') },
              { min: 6, max: 11, message: t('login.passwordLength') }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('login.passwordPlaceholder')}
              size="large"
              iconRender={(visible) => (
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              )}
            />
          </Form.Item>

          <Form.Item
            name="code"
            label={t('login.verifyCode')}
            rules={[{ required: true, message: t('login.verifyCodeRequired') }]}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Input
                prefix={<KeyOutlined />}
                placeholder={t('login.verifyCodePlaceholder')}
                size="large"
                maxLength={4}
                style={{ flex: 1 }}
              />
              <div style={{ cursor: 'pointer', userSelect: 'none' }} onClick={generateVerifyCode}>
                <VerifyCode code={verifyCode} />
              </div>
            </div>
          </Form.Item>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#64748b' }}>
              <span onClick={handleForgetPassword}>{t('login.forgetPassword')}</span>
              <span style={{ margin: '0 8px' }}>|</span>
              <span onClick={handleRegister}>{t('login.register')}</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              >
                {t('login.agree')}
              </Checkbox>
            </div>
          </div>

          <Form.Item style={{ marginBottom: '12px' }}>
            <Space style={{ width: '100%', justifyContent: 'center' }} size={8}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  flex: 1,
                  height: '44px',
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {t('login.loginBtn')}
              </Button>
              <Button
                onClick={handleGuestLogin}
                style={{ flex: 1, height: '44px', fontSize: '0.95rem' }}
              >
                {t('login.guestBtn')}
              </Button>
              <Button
                onClick={handleReset}
                style={{ flex: 1, height: '44px', fontSize: '0.95rem' }}
              >
                {t('login.resetBtn')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </LoginBox>
      </LoginContainer>
      )}
    </>
  )
}

export default Login
