import {
  Stepper,
  Button,
  Group,
  TextInput,
  Select,
  Container,
  Paper,
  Title,
  Modal,
  Radio,
  Stack,
  Text,
  Card,
} from "@mantine/core";
import { useState } from "react";

interface OrderData {
  name: string;
  email: string;
  address: string;
  shippingMethod: string;
  pickupPoint: string;
  paymentMethod: string;
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

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleFinalize = () => {
    console.log("Rendelés véglegesítve:", orderData);
    alert("Rendelés elküldve! Nézd meg a konzolt.");
  };

  const pickupPoints = [
    "Budapest - Westend",
    "Debrecen - Fórum",
    "Szeged - Árkád",
  ];

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg" ta="center">
          🛒 Online rendelés
        </Title>

        <Stepper active={active}>
          {/* 1. Lépés */}
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
              <TextInput
                label="Email"
                placeholder="email@example.com"
                value={orderData.email}
                onChange={(e) =>
                  setOrderData({ ...orderData, email: e.target.value })
                }
                required
              />
              <TextInput
                label="Cím"
                placeholder="Számlázási cím"
                value={orderData.address}
                onChange={(e) =>
                  setOrderData({ ...orderData, address: e.target.value })
                }
                required
              />
            </Stack>
          </Stepper.Step>

          {/* 2. Lépés */}
          <Stepper.Step label="Szállítás">
            <Stack>
              <Select
                label="Szállítási mód"
                placeholder="Válassz..."
                data={[
                  { value: "home", label: "Házhozszállítás" },
                  { value: "pickup", label: "Személyes átvétel" },
                ]}
                value={orderData.shippingMethod}
                onChange={(value) =>
                  setOrderData({ ...orderData, shippingMethod: value || "" })
                }
              />

              {orderData.shippingMethod === "pickup" && (
                <>
                  <Button variant="outline" onClick={() => setOpened(true)}>
                    Átvételi pont kiválasztása
                  </Button>

                  <Text>
                    Kiválasztott pont:{" "}
                    <strong>{orderData.pickupPoint || "Nincs kiválasztva"}</strong>
                  </Text>
                </>
              )}
            </Stack>
          </Stepper.Step>

          {/* 3. Lépés */}
          <Stepper.Step label="Fizetés">
            <Radio.Group
              label="Fizetési mód"
              value={orderData.paymentMethod}
              onChange={(value) =>
                setOrderData({ ...orderData, paymentMethod: value })
              }
            >
              <Stack mt="sm">
                <Radio value="card" label="Bankkártya" />
                <Radio value="cash" label="Utánvét" />
              </Stack>
            </Radio.Group>
          </Stepper.Step>

          {/* 4. Lépés */}
          <Stepper.Completed>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                📋 Összegzés
              </Title>
              <Text><strong>Név:</strong> {orderData.name}</Text>
              <Text><strong>Email:</strong> {orderData.email}</Text>
              <Text><strong>Cím:</strong> {orderData.address}</Text>
              <Text><strong>Szállítás:</strong> {orderData.shippingMethod}</Text>
              {orderData.shippingMethod === "pickup" && (
                <Text>
                  <strong>Átvételi pont:</strong> {orderData.pickupPoint}
                </Text>
              )}
              <Text><strong>Fizetés:</strong> {orderData.paymentMethod}</Text>

              <Button mt="lg" fullWidth onClick={handleFinalize}>
                ✅ Rendelés véglegesítése
              </Button>
            </Card>
          </Stepper.Completed>
        </Stepper>

        {/* Navigáció */}
        <Group justify="space-between" mt="xl">
          {active > 0 && active < 4 && (
            <Button variant="default" onClick={prevStep}>
              Vissza
            </Button>
          )}
          {active < 3 && (
            <Button onClick={nextStep}>
              Tovább
            </Button>
          )}
        </Group>
      </Paper>

      {/* Popup modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Válassz átvételi pontot"
      >
        <Stack>
          {pickupPoints.map((point) => (
            <Button
              key={point}
              variant="light"
              onClick={() => {
                setOrderData({ ...orderData, pickupPoint: point });
                setOpened(false);
              }}
            >
              {point}
            </Button>
          ))}
        </Stack>
      </Modal>
    </Container>
  );
}
