                   {/* <Form.Item
                      name=""
                      label="แพ็กเกจ"
                    >
                      {pkgDetail.map((pkg, index) => (
                        <Form.Item key={index}>
                          <Card
                            size="small"
                            title={`แพ็กเกจ ${index + 1}`}

                            extra={
                              pkgDetail.length > 1 && (
                                <Button type="danger" onClick={() => handleDelete(pkg.pkg_id)}>X</Button>
                              )
                            }
                          >
                            <Form.Item
                              name={['pkgDetail', index, 'pkgName']}
                              label="ชื่อแพ็กเกจ"
                              initialValue={pkg.pkg_name}
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: "กรุณาใส่ชื่อแพ็กเกจ",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              name={['pkgDetail', index, 'pkgDesc']}
                              label="คำอธิบาย"
                              initialValue={pkg.pkg_desc}
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: "กรุณาใส่คำอธิบาย",
                                },
                              ]}
                            >
                              <Input.TextArea showCount maxLength={200} autoSize={{ minRows: 3, maxRows: 5 }} />
                            </Form.Item>

                            <Space
                              style={{
                                display: 'flex',
                                flexDirection: "row",
                                flexWrap: "wrap"
                              }}
                            >
                              <Form.Item
                                name={['pkgDetail', index, 'pkgDuration']}
                                label="จำนวนวัน"
                                initialValue={pkg.pkg_duration}
                                rules={[
                                  {
                                    required: true,
                                    message: "กรุณาใส่จำนวนวัน",
                                  },
                                  { type: "number" }
                                ]}
                              >
                                <InputNumber suffix="วัน" className="inputnumber-css" />
                              </Form.Item>

                              <Form.Item
                                name={['pkgDetail', index, 'pkgEdit']}
                                label="จำนวนแก้ไข"
                                initialValue={pkg.pkg_edits}
                                rules={[
                                  {
                                    required: true,
                                    message: "กรุณาใส่จำนวนแก้ไข",
                                  },
                                  { type: "number" }
                                ]}
                              >
                                <InputNumber suffix="ครั้ง" className="inputnumber-css" />
                              </Form.Item>

                              <Form.Item
                                name={['pkgDetail', index, 'pkgPrice']}
                                label="ราคาเริ่มต้น"
                                initialValue={pkg.pkg_min_price}
                                rules={[
                                  {
                                    required: true,
                                    message: "กรุณาใส่ราคาเริ่มต้น",
                                  },
                                  { type: "number" }
                                ]}
                              >
                                <InputNumber suffix="บาท" className="inputnumber-css" />
                              </Form.Item>
                            </Space>
                          </Card>
                          <Button type="dashed" onClick={() => DeletePackage(pkg.pkg_id)}>
                            - ลบแพ็กเกจ
                          </Button> 
                        </Form.Item>

                      ))}

                      <Form.List name="pkgs" >
                      {(fields, { add, remove }, { errors }) => (
                        <div
                          style={{
                            display: 'flex',
                            rowGap: 16,
                            flexDirection: 'column',
                          }}
                        >
                          {fields.map((field) => (
                            <Card
                              size="small"
                              title={`แพ็กเกจ ${field.name + 1}`}
                              key={field.key}
                              extra={
                                field.name !== 0 && <CloseOutlined
                                  onClick={() => {
                                    remove(field.name);
                                  }}
                                />
                              }
                            >
                              <Form.Item label="ชื่อแพ็กเกจ" name={[field.name, 'pkgName']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: "กรุณาใส่ชื่อแพ็กเกจ",
                                  },
                                ]}>
                                <Input />
                              </Form.Item>
                              <Form.Item label="คำอธิบาย" name={[field.name, 'pkgDesc']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: "กรุณาใส่คำอธิบาย",
                                  },
                                ]}>
                                <TextArea showCount maxLength={200}
                                  autoSize={{
                                    minRows: 3,
                                    maxRows: 5,
                                  }} />
                              </Form.Item>

                              <Space
                                style={{
                                  display: 'flex',
                                  flexDirection: "row",
                                  flexWrap: "wrap"
                                }}>
                                <Form.Item
                                  label="จำนวนวัน"
                                  name={[field.name, 'pkgDuration']}
                                  rules={[
                                    {
                                      required: true,
                                      message: "กรุณาใส่คำอธิบาย",
                                    },
                                    { type: "number" }
                                  ]}
                                >
                                  <InputNumber suffix="วัน" className="inputnumber-css" />
                                </Form.Item>
                                <Form.Item
                                  label="จำนวนแก้ไข"
                                  name={[field.name, 'pkgEdit']}
                                  rules={[
                                    {
                                      required: true,
                                      message: "กรุณาใส่คำอธิบาย",
                                    },
                                    { type: "number" }
                                  ]}
                                >

                                  <InputNumber suffix="ครั้ง" className="inputnumber-css" />
                                </Form.Item>
                                <Form.Item
                                  label="ราคาเริ่มต้น"
                                  name={[field.name, 'pkgPrice']}
                                  rules={[
                                    {
                                      required: true,
                                      message: "กรุณาใส่คำอธิบาย",
                                    },
                                    { type: "number" }
                                  ]}

                                >
                                  <InputNumber suffix="บาท" className="inputnumber-css" />
                                </Form.Item>
                              </Space>

                              <Form.Item label={<>
                                ขั้นตอนการทำงาน
                                <Tooltip title="ขั้นตอนการทำงานคือภาพทั้งหมดที่จะส่งให้ลูกค้าดู การจ่ายเงินครั้งแรกคือหลังจากที่นักวาดส่งภาพไปแล้ว จ่ายเงินครึ่งหลังจะได้จ่ายเมื่องานดำเนินไปถึง 50% แล้ว" color="#2db7f5">
                                  <Icon.Info />
                                </Tooltip>
                              </>}
                                name=""
                              >
                                <Form.List
                                  name={[field.name, 'step']}
                                  rules={[
                                    {
                                      validator: async (_, step) => {
                                        if (!step || step.length === 0) {
                                          console.log("ยังไม่เพิ่มการทำงาน")
                                          return Promise.reject(new Error('เพิ่มการทำงานอย่างน้อย 1 ขั้นตอน'));

                                        }
                                      },
                                    },
                                  ]}
                                >
                                  {(subFields, subOpt, { errors }) => (
                                    <div style={{ display: 'flex', flexDirection: 'column' }} >
                                      <Space
                                        style={{
                                          display: 'flex'
                                        }}
                                        align="baseline"
                                      >
                                        <div style={{ width: "1rem", textAlign: "right" }}>1: </div>
                                        <Form.Item
                                          name="draft"
                                          validateTrigger={['onChange', 'onBlur']}>
                                          <Input placeholder="ตัวอย่าง ภาพลงสี" defaultValue="ภาพร่าง" readOnly />
                                        </Form.Item>
                                      </Space>


                                      {subFields.map((subField) => (
                                        <>
                                          <Space
                                            key={subField.key}
                                            style={{
                                              display: 'flex'

                                            }}
                                            align="baseline"
                                          >
                                            <div style={{ width: "1rem", textAlign: "right" }}>{subField.name + 2}: </div>
                                            <Form.Item
                                              name={subField.name}
                                              validateTrigger={['onChange', 'onBlur']}
                                              rules={[
                                                {
                                                  required: true,
                                                  whitespace: true,
                                                  message: "กรุณาใส่ขั้นตอนการทำงาน",
                                                },
                                              ]}>
                                              <Input prefix="ภาพ" placeholder="ตัวอย่าง ภาพลงสี" />
                                            </Form.Item>


                                            <MinusCircleOutlined onClick={() => subOpt.remove(subField.name)} />


                                          </Space>

                                        </>
                                      ))}

                                      <Form.Item
                                        style={{

                                          marginLeft: '1.5rem',
                                        }}>


                                        <Button
                                          type="dashed"
                                          style={{
                                            width: 'fit-content',
                                            // marginLeft: '1.5rem',
                                          }}

                                          onClick={() => subOpt.add()} block>
                                          + เพิ่มขั้นตอนการทำงาน
                                        </Button>


                                      </Form.Item>

                                      <Space
                                        style={{
                                          display: 'flex'
                                        }}
                                        align="baseline"
                                      >
                                        <div style={{ width: "1rem", textAlign: "right" }}>{subFields.length + 2}: </div>
                                        <Form.Item
                                          name="final"
                                        >
                                          <Input placeholder="ตัวอย่าง ภาพลงสี" defaultValue="ภาพไฟนัล" readOnly />
                                        </Form.Item>
                                      </Space>
                                      <Form.ErrorList errors={errors} style={{
                                        marginLeft: '1.5rem',
                                      }} />
                                    </div>

                                  )}



                                </Form.List>
                              </Form.Item>
                            </Card>
                          ))}
                          <Button type="dashed" onClick={() => add()}>
                            + เพิ่มแพ็กเกจ
                          </Button>
                        </div>
                      )}
                      </Form.List>
         
                    </Form.Item> */}