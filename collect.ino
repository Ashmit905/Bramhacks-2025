// the setup routine runs once when you press reset:
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
}

// the loop routine runs over and over again forever:
void loop() {
  // read the input on analog pin 0:
  int s1 = analogRead(A0);
  int s2 = analogRead(A1);
  // print out the value you read:
  Serial.println(s1);
  Serial.print(",");
  Serial.println(s2);
  delay(1);        // delay in between reads for stability
}
