#include <Adafruit_NeoPixel.h>

//
// USER SETTINGS
//
#define PIN            11        // NeoPixel data pin
#define NUMPIXELS      14        // Number of LEDs in the ring
#define SENSORPIN      A0        // LDR analog input pin

#define MAX_LUX        10000.0   // Highest useful lux
#define MAX_BRIGHTNESS 255x`       // NeoPixel brightness
#define MIN_BRIGHTNESS 0         // Minimum LED level
#define SMOOTHING      0.1       // 0.0 = instant, 1.0 = very slow


Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(9600);
  pixels.begin();
  pixels.setBrightness(MAX_BRIGHTNESS);  // Global brightness once
}

void loop() {

  //
  // Read and convert the sensor value
  //
  float reading = analogRead(SENSORPIN);
  if (reading < 1) reading = 1; // avoid division by zero

  // Convert LDR reading to resistance
  float resistance = 10000.0 * ((1023.0 - reading) / reading);

  // Convert resistance to lux
  float lux = (1.25e8) * pow(resistance, -1.4);

  if (lux > MAX_LUX) lux = MAX_LUX;

  Serial.print("Lux: ");
  Serial.println(lux);

  //
  // Map lux → brightness (inverse)
  // Dark = 255, bright = 0
  //
  float adaptive = MAX_BRIGHTNESS * (1.0 - (lux / MAX_LUX));
  if (adaptive < MIN_BRIGHTNESS) adaptive = MIN_BRIGHTNESS;
  if (adaptive > MAX_BRIGHTNESS) adaptive = MAX_BRIGHTNESS;

  //
  // Smooth sensor noise
  //
  static float smoothAdaptive = 0;
  smoothAdaptive =
      smoothAdaptive * (1.0 - SMOOTHING) +
      adaptive        * SMOOTHING;

  uint8_t adaptiveLevel = (uint8_t)smoothAdaptive;

  //
  // LED OUTPUT
  //

  // First half: always ON at full brightness
  for (int i = 0; i < NUMPIXELS / 2; i++) {
    pixels.setPixelColor(i, pixels.Color(255, 255, 255));
  }

  // Second half: adaptive brightness
  for (int i = NUMPIXELS / 2; i < NUMPIXELS; i++) {
    pixels.setPixelColor(i, pixels.Color(adaptiveLevel, adaptiveLevel, adaptiveLevel));
  }

  pixels.show();
//  delay(10);
}
