import React from "react";
import QRCode from "react-qr-code";
import {
  Card,
  Row,
  Avatar,
  Select,
  Button,
  Form,
  Input,
  Tooltip,
  Typography,
  Switch,
  Collapse,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

import RecommendationModal from "../../../components/RecommendationModal";
import { dataTestIds, sectionHeaders, buttonText } from "../constants";

const { Option } = Select;
const { Paragraph, Text } = Typography;
const { Panel } = Collapse;

const YouPageForm = ({
  navigateToLogin,
  isLoading,
  onFinish,
  user,
  countries,
  cities,
  fetchCities,
  usersForRecommendations,
  setUsersForRecommendations,
  areRecommendedUsersFriends,
  setAreRecommendedUsersFriends,
  updatedDestination,
  setUseSharingQr,
  useSharingQr,
  tailFormItemLayout,
}) => {
  const [form] = Form.useForm();
  return (
    <div style={{ marginTop: 50 }}>
      <Form
        form={form}
        data-testid={dataTestIds.form}
        className="you-form"
        scrollToFirstError
        onFinish={onFinish}
      >
        <Row style={{ margin: 24 }}>
          <Card
            style={{
              width: "100%",
            }}
            loading={!user || isLoading}
          >
            <Row type="flex" justify="center" style={{ marginBottom: 24 }}>
              {user?.profile_image ? (
                <Avatar size={140} src={user.profile_image} />
              ) : (
                <Avatar size={140} icon={<UserOutlined />} />
              )}
            </Row>
            <Form.Item
              name="fullName"
              label="Full name"
              tooltip="This is how users will recognise you outside of your username."
              initialValue={user?.full_name}
              rules={[
                {
                  required: true,
                  message: "Please input your name",
                  whitespace: true,
                },
              ]}
            >
              <Input
                placeholder="George Ballard"
                data-testid={dataTestIds.fullName}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              tooltip="This will only be used for login and password reset. We won't send you any nonsense."
              initialValue={user?.email}
              rules={[
                {
                  type: "email",
                  message: "The input is not valid email.",
                },
                {
                  required: true,
                  message: "Please input your email.",
                },
              ]}
            >
              <Input
                placeholder="georgeballard@gmail.com"
                data-testid={dataTestIds.email}
              />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              placeholder="beyoncebooty"
              tooltip="This is how other users will find you. It is recommended that you reuse your instagram handle."
              initialValue={user?.username}
              rules={[
                {
                  required: true,
                  message: "Please input your username",
                  whitespace: true,
                },
              ]}
            >
              <Input
                placeholder="beyoncebooty"
                data-testid={dataTestIds.username}
              />
            </Form.Item>
          </Card>
        </Row>

        <Row style={{ margin: 24 }}>
          <Card
            title={
              <Tooltip title="This is how friends will contact you.">
                {sectionHeaders.contact}
              </Tooltip>
            }
            style={{
              width: "100%",
            }}
            loading={!user || isLoading}
          >
            <Form.Item
              name="contactEmail"
              label="Email"
              initialValue={user?.contact_email}
              rules={[
                {
                  type: "email",
                  message: "The input is not valid email.",
                },
              ]}
            >
              <Input
                placeholder="georgeballard@gmail.com"
                data-testid={dataTestIds.contactEmail}
              />
            </Form.Item>
            <Form.Item
              name="contactInstagram"
              label="Instagram"
              placeholder="beyoncebooty"
              initialValue={user?.contact_instagram}
            >
              <Input
                placeholder="beyoncebooty"
                data-testid={dataTestIds.contactInstagram}
              />
            </Form.Item>
            <Form.Item
              name="contactNumber"
              label="Phone number (WhatsApp/Signal etc)"
              tooltip="Add the country code to ensure that you appear correctly in WhatsApp, Signal etc."
              initialValue={user?.contact_mobile}
            >
              <Input
                placeholder="+447804233529"
                data-testid={dataTestIds.contactNumber}
              />
            </Form.Item>
          </Card>
        </Row>
        {/* TODO george uncomment and test */}
        {user?.destinations[0]?.id && (
          <Row style={{ margin: 24 }}>
            <Card
              title="Current location"
              style={{
                width: "100%",
              }}
              loading={!user || isLoading}
            >
              <Form.Item
                name="country"
                label="Country"
                initialValue={user?.destinations[0]?.country.id}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  data-testid={dataTestIds.userCountry}
                  placeholder="Search for a country"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                  onChange={(value) => {
                    form.setFieldsValue({ city: null });
                    fetchCities(value);
                  }}
                >
                  {countries &&
                    countries.map((item) => (
                      <Option
                        key={item.id}
                        value={item.id}
                        data-testid={`${dataTestIds.option}-country${item.id}`}
                      >
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="city"
                label="City (Optional)"
                initialValue={user?.destinations[0]?.city?.id}
              >
                <Select
                  data-testid={dataTestIds.userCity}
                  placeholder="Search for a city"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                  onChange={(value) => {
                    if (value) {
                      form.setFieldsValue({ city: value });
                    } else {
                      form.setFieldsValue({ city: null });
                    }
                  }}
                >
                  {cities &&
                    cities.map((item) => (
                      <Option
                        key={item.id}
                        value={item.id}
                        data-testid={`${dataTestIds.option}-city${item.id}`}
                      >
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Card>
          </Row>
        )}
        <Row style={{ margin: 24 }}>
          <Card
            title={sectionHeaders.uniqueLink}
            style={{
              width: "100%",
            }}
          >
            <Collapse defaultActiveKey={["1"]} ghost>
              <Panel header={sectionHeaders.regLink} key="1">
                <Row>
                  <Text>
                    If your friend doesn't have the the app, then share the link
                    below with your friend, and you will be sent a friend
                    request from them as part of their registration:
                  </Text>
                </Row>
                <Row
                  style={{
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                >
                  <Switch
                    data-testid={dataTestIds.sharingCodeSwitch}
                    checkedChildren="In person"
                    unCheckedChildren="Via message"
                    checked={useSharingQr}
                    onChange={(value) => setUseSharingQr(value)}
                  />
                </Row>

                <Row
                  style={{
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                >
                  {useSharingQr ? (
                    <QRCode
                      data-testid={dataTestIds.sharingQrCode}
                      size={100}
                      value={`${window.location.origin}/register?registration_code=${user?.uuid}`}
                    />
                  ) : (
                    <Paragraph
                      data-testid={dataTestIds.sharingLink}
                      copyable
                      type="secondary"
                    >{`${window.location.origin}/register?registration_code=${user?.uuid}`}</Paragraph>
                  )}
                </Row>
              </Panel>
              <Panel header="Add friend link" key="2">
                <Row>
                  <Text>
                    If you friend already has the app, then share the link below
                    with your friends, and you will be sent a friend request
                    from them:
                  </Text>
                </Row>
                <Row
                  style={{
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                >
                  <Switch
                    checkedChildren="In person"
                    unCheckedChildren="Via message"
                    checked={useSharingQr}
                    onChange={(value) => setUseSharingQr(value)}
                  />
                </Row>
                <Row
                  style={{
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                >
                  {useSharingQr ? (
                    <QRCode
                      size={100}
                      value={`${window.location.origin}/friends?add_friend_code=${user?.uuid}`}
                    />
                  ) : (
                    <Paragraph
                      copyable
                      type="secondary"
                    >{`${window.location.origin}/friends?add_friend_code=${user?.uuid}`}</Paragraph>
                  )}
                </Row>
              </Panel>
            </Collapse>
          </Card>
        </Row>
        <Row type="flex" justify="space-around" style={{ marginBottom: 24 }}>
          <Form.Item {...tailFormItemLayout}>
            <Button
              data-testid={dataTestIds.updateBtn}
              htmlType="submit"
              loading={!user || isLoading}
            >
              {buttonText.update}
            </Button>
          </Form.Item>
          <Button
            data-testid={dataTestIds.logOutBtn}
            style={{ ...tailFormItemLayout }}
            loading={isLoading}
            onClick={() => {
              localStorage.removeItem("token");
              navigateToLogin();
            }}
          >
            {buttonText.logOut}
          </Button>
        </Row>
      </Form>
      {usersForRecommendations?.length > 0 && (
        <RecommendationModal
          userList={usersForRecommendations}
          friends={areRecommendedUsersFriends}
          countryName={updatedDestination}
          loading={isLoading}
          visible={usersForRecommendations.length > 0}
          onOk={() => {
            setUsersForRecommendations([]);
            setAreRecommendedUsersFriends(false);
          }}
          onCancel={() => {
            setUsersForRecommendations([]);
            setAreRecommendedUsersFriends(false);
          }}
        />
      )}
    </div>
  );
};

export default YouPageForm;
