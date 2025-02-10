import { useState, useEffect } from "react"
import { Layout, Form, Radio, Input, Checkbox, Button, Typography, Space, message } from "antd"
import "./style/storage.css"
import { addOrder, getStorageCabinetSettingList } from "../../api"

const { Header, Content } = Layout
const { Title } = Typography

function Storage() {
  const [form] = Form.useForm()
  const [customDuration, setCustomDuration] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const [isVip, setIsVip] = useState(false) 
  const [storageSettingData, setStorageSettingData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchStorageSettingData = () => {
    setLoading(true)
    getStorageCabinetSettingList()
      .then((res) => {
        if (res && Array.isArray(res.settingList)) {
          setStorageSettingData(res.settingList)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        message.error("获取柜子设置数据失败")
      })
  };

  // init
  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
            const user = JSON.parse(storedUserData);
            setIsVip(user.roleType === 'VIP' ? true : false);
        }
    fetchStorageSettingData()
  }, [])

  useEffect(() => {
    calculatePrice(form.getFieldsValue())
  }, [form.getFieldsValue])

  const handleDurationChange = (e) => {
    setCustomDuration(e.target.value === "custom")
    calculatePrice(form.getFieldsValue())
  }

  const calculatePrice = (values) => {
    if (!Array.isArray(storageSettingData)) {
      setEstimatedPrice(0);
      return;
    }
  
    let duration = values.duration;
  
    let setting = storageSettingData.find(setting => 
      setting.sizeType === values.lockerType && 
      (duration === setting.dateType || duration === "custom")
    );
  
    let basePrice = setting?.price || 0; // 避免 `undefined` 影响计算

    setEstimatedPrice(duration === "custom" ? basePrice * (values.customMonths || 1) : basePrice);
  };
  
  const onFinish = (values) => {
    setLoading(true);
    console.log("提交的表单数据:", values)
    const addData = {
      sizeType: values.lockerType,
      dateType: values.duration === "custom" ? "OneMonth" : values.duration,
      monthCount: values.customMonths,
      name: values.itemName,
      isValuable: values.isValuable,
      useMemberRenewalService: values.useVipService === undefined ? false : values.useVipService,
      estimatedPrice: estimatedPrice
    }

    const res = addOrder(addData)
    .then((res) => {
      if(res === 1) {
        message.success("提交成功")
        form.resetFields()
        setEstimatedPrice(0)
      }
    })
    .catch((error) => {
      console.log("提交失败:", error)
      message.error(error.response.data.message)
    });

    setLoading(false)
  }

  const onValuesChange = (changedValues, allValues) => {
    calculatePrice(allValues)
  }

  return (
    <Layout className="layout">
      <Header className="header">
        <Title level={2} style={{ color: "white", margin: "16px 0" }}>
          欢迎使用Easy Storage, 请填写以下信息
        </Title>
      </Header>
      <Content className="content">
        <div className="form-container">
          <Form
            form={form}
            name="storage_form"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              label="请选择存储柜子类型"
              name="lockerType"
              rules={[{ required: true, message: "请选择柜子类型" }]}
            >
              <Radio.Group>
                <Radio value="Small">小</Radio>
                <Radio value="Medium">中</Radio>
                <Radio value="Large">大</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="请选择存储时间" name="duration" rules={[{ required: true, message: "请选择存储时间" }]}>
              <Radio.Group onChange={handleDurationChange}>
                <Radio value="ThreeDays">三天</Radio>
                <Radio value="OneWeek">一周</Radio>
                <Radio value="OneMonth">一个月</Radio>
                <Radio value="custom">
                  <Space>
                    <Form.Item name="customMonths" noStyle>
                      <Input style={{ width: 100 }} disabled={!customDuration} placeholder="请输入" />
                    </Form.Item>
                    月
                  </Space>
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="物品名称" name="itemName" rules={[{ required: true, message: "请输入物品名称" }]}>
              <Input placeholder="请输入物品名称" />
            </Form.Item>

            <Form.Item name="isValuable" valuePropName="checked">
              <Checkbox>是否有贵重物</Checkbox>
            </Form.Item>

            {isVip && (  // 只有VIP用户才显示此项
              <Form.Item name="useVipService" valuePropName="checked">
                <Checkbox>是否使用Vip免费延期服务</Checkbox>
              </Form.Item>
            )}

            <div className="notice-section">
              <p style={{ color: 'red' }}>告知:到期后一个星期内未取走或者续期将由管理员处理丢弃</p>
              <Space align="center">
                <span>预估总价￥</span>
                <Input value={estimatedPrice} style={{ width: 120 }} readOnly />
                <span>元</span>
              </Space>
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error("请确认服务条款"))),
                  },
                ]}
              >
                <Checkbox>确认商家服务条款</Checkbox>
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                确定
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  )
}

export default Storage
