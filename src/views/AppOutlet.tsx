'use client'
import OutletContainer from '@/ui/outlet/OutletContainer'
import { ConfigProvider, Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import esES from 'antd/locale/es_ES'
import { antd } from '@/config/antd'
import SessionProvider from '@/context/providers/SessionProvider'

const AppOutlet: React.FC = () => {
  //const isMobile = useResponsive('(max-width: 768px)')
  return (
    <SessionProvider>
      <ConfigProvider theme={antd} locale={esES}>
        <Layout className="max-h-dvh! overflow-hidden! text-[14px]">
          <OutletContainer isMobile={false}>
            <Outlet />
          </OutletContainer>
        </Layout>
      </ConfigProvider>
    </SessionProvider>
  )
}

export default AppOutlet
