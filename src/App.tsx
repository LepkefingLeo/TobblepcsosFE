import { Stepper, Button, Group, TextInput, Select, Container, Paper, Title, Modal, Radio, Stack, Text, Card } from "@mantine/core";
import { useState } from "react";

interface OrderData {
  name: string;
  email: string;
  address: string;
  shippingMethod: string;
  pickupPoint: string;
  paymentMethod: string;
}

interface Errors {
  name?: string;
  email?: string;
  address?: string;
  shippingMethod?: string;
  pickupPoint?: string;
  paymentMethod?: string;
}

function validate(orderData: OrderData, step: number): Errors {
  const errors: Errors = {};
  if (step === 0) {
    if (!orderData.name.trim()) errors.name = "Név megadása kötelező!";
    if (!orderData.email.trim()) errors.email = "Email megadása kötelező!";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(orderData.email))
      errors.email = "Érvénytelen email cím!";
    if (!orderData.address.trim()) errors.address = "Cím megadása kötelező!";
  }
  if (step === 1) {
    if (!orderData.shippingMethod) errors.shippingMethod = "Válasszon szállítási módot!";
    if (orderData.shippingMethod === "Személyes átvétel" && !orderData.pickupPoint)
      errors.pickupPoint = "Válasszon átvételi pontot!";
  }
  if (step === 2) {
    if (!orderData.paymentMethod) errors.paymentMethod = "Válasszon fizetési módot!";
  }
  return errors;
}

export default function App() {
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    name: "",
    email: "",
    address: "",
    shippingMethod: "",
    pickupPoint: "",
    paymentMethod: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const nextStep = () => {
    const stepErrors = validate(orderData, active);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) setActive((current) => (current < 3 ? current + 1 : current));
  };
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleFinalize = () => {
    const stepErrors = validate(orderData, 2);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      console.log("Rendelése véglegesítve:", orderData);
      alert("Rendelése elküldve!");
    }
  };

  const popupForPickupPoints = [
    "Budapest, Örs vezér tere 25/A, 1106 - ÁRKÁD",
    "Budapest, Váci út 1-3, 1062 - WESTEND",
    "Budapest, Kerepesi út 9, 1087 - ARÉNA PLÁZA",
    "Budapest, Vak Bottyán u. 75/A-C, 1191 - KÖKI"
  ];

  return (
    <Container size="sm" py="xl" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
        <Title order={2} mb="lg" ta="center">
          <picture className="Logo"><img src="/src/assets/logo.png" alt="Logo" width="30" height="30" ></img></picture> Online rendelés
        </Title>

        <Stepper active={active}>
          <Stepper.Step label="Számlázás">
            <Stack>
              <TextInput
                label="Név"
                placeholder="Teljes név"
                value={orderData.name}
                onChange={(e) =>
                  setOrderData({ ...orderData, name: e.target.value })
                }
                required
              />
              {errors.name && (
                <Text c="red" size="sm">{errors.name}</Text>
              )}

              <TextInput
                label="Email"
                placeholder="email@example.com"
                value={orderData.email}
                onChange={(e) =>
                  setOrderData({ ...orderData, email: e.target.value })
                }
                required
              />
              {errors.email && (
                <Text c="red" size="sm">{errors.email}</Text>
              )}

              <TextInput
                label="Cím"
                placeholder="Számlázási cím"
                value={orderData.address}
                onChange={(e) =>
                  setOrderData({ ...orderData, address: e.target.value })
                }
                required
              />
              {errors.address && (
                <Text c="red" size="sm">{errors.address}</Text>
              )}
            </Stack>
          </Stepper.Step>
          <Stepper.Step label="Szállítás">
            <Stack>
              <Select
                label="Szállítási mód"
                placeholder="Válasszon..."
                data={[
                  { value: "Házhozszállítás", label: "Házhozszállítás" },
                  { value: "Személyes átvétel", label: "Személyes átvétel" },
                ]}
                value={orderData.shippingMethod}
                onChange={(value) =>
                  setOrderData({ ...orderData, shippingMethod: value || "" })
                }
                required
              />
              {errors.shippingMethod && (
                <Text c="red" size="sm">{errors.shippingMethod}</Text>
              )}

              {orderData.shippingMethod === "Személyes átvétel" && (
                <>
                  <Button variant="outline" onClick={() => setOpened(true)}>
                    Átvételi pont kiválasztása
                  </Button>
                  <Text>
                    Kiválasztott pont:{" "}
                    <strong>
                      {orderData.pickupPoint || "Nincs kiválasztva"}
                    </strong>
                  </Text>
                  {errors.pickupPoint && (
                    <Text c="red" size="sm">{errors.pickupPoint}</Text>
                  )}
                </>
              )}
            </Stack>
          </Stepper.Step>
          <Stepper.Step label="Fizetés">
            <Radio.Group
              label="Fizetési mód"
              value={orderData.paymentMethod}
              onChange={(value) =>
                setOrderData({ ...orderData, paymentMethod: value })
              }
              required
              error={errors.paymentMethod}
            >
              <Stack mt="sm">
                <Radio value="Bankkártya" label="Bankkártya" />
                <Radio value="Utánvét" label="Utánvét" />
              </Stack>
            </Radio.Group>
          </Stepper.Step>
          <Stepper.Completed>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Összegzés
              </Title>
              <Text>
                <strong>Név:</strong> {orderData.name}
              </Text>
              <Text>
                <strong>Email:</strong> {orderData.email}
              </Text>
              <Text>
                <strong>Cím:</strong> {orderData.address}
              </Text>
              <Text>
                <strong>Szállítás módja:</strong> {orderData.shippingMethod}
              </Text>
              {orderData.shippingMethod === "pickup" && (
                <Text>
                  <strong>Átvételi pont:</strong> {orderData.pickupPoint}
                </Text>
              )}
              <Text>
                <strong>Fizetés:</strong> {orderData.paymentMethod}
              </Text>

              <Button mt="lg" color="green" fullWidth onClick={handleFinalize}>
                Rendelés véglegesítése
              </Button>
            </Card>
          </Stepper.Completed>
        </Stepper>

        <Group justify="space-between" mt="xl">
          {active > 0 && active < 4 && (
            <Button variant="default" onClick={prevStep}>
              Vissza
            </Button>
          )}
          {active < 3 && <Button onClick={nextStep}>Tovább</Button>}
        </Group>
      </Paper>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Válasszon átvételi pontot:"
        centered
        overlayProps={{
          blur: 2,
          backgroundOpacity: 0.55,
        }}
      >
        <Stack>
          {popupForPickupPoints.map((point) => (
            <Button
              key={point}
              variant="light"
              onClick={() => {
                setOrderData({ ...orderData, pickupPoint: point });
                setOpened(false);
              }}
              style={{ width: "100%" }}
            >
              {point}
            </Button>
          ))}
        </Stack>
      </Modal>
    </Container>
  );
}
