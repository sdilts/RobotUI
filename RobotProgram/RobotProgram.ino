#include <Mailbox.h>
#include <Bridge.h>
#include <BridgeServer.h>
#include <BridgeClient.h>
#include <Wire.h>
#include <Adafruit_MotorShield.h>
#include "utility/Adafruit_MS_PWMServoDriver.h"

#define MAX_MESSAGE_SZ 128
#define MOTOR_SPEED 200

BridgeServer server;

Adafruit_MotorShield AFMS = Adafruit_MotorShield();
Adafruit_DCMotor *fLMotor = AFMS.getMotor(1);
Adafruit_DCMotor *fRMotor = AFMS.getMotor(2);
Adafruit_DCMotor *bRMotor = AFMS.getMotor(3);
Adafruit_DCMotor *bLMotor = AFMS.getMotor(4);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Bridge.begin();
  server.begin();

  AFMS.begin();

  fLMotor->setSpeed(MOTOR_SPEED);
  fRMotor->setSpeed(MOTOR_SPEED);
  bLMotor->setSpeed(MOTOR_SPEED);
  bRMotor->setSpeed(MOTOR_SPEED);
}

void loop() {
  // put your main code here, to run repeatedly:
  processCommand();
  //serverProcess();
}


inline void serverProcess() {
  BridgeClient client = server.accept();

  // There is a new client?
  if (client) {
      String command = client.readString();
      Serial.println(command);
  }
}

inline void processCommand() {
  //Serial.println("Checking mailbox");
  if (Mailbox.messageAvailable()) {
    unsigned char message[MAX_MESSAGE_SZ];
    Mailbox.readMessage(message, MAX_MESSAGE_SZ);
    Serial.println("Message: ");
    char * pch = strtok(message, ",");
    while (pch) {
      delay(100);
      spin(atoi(pch));
      pch = strtok(NULL, ", ");
      goForward(atoi(pch));
      pch = strtok(NULL, ", ");
    }
//    for(int i = 0; i < MAX_MESSAGE_SZ; i++) {
//      message[i] = '\0';
//    }
    Serial.println("END MESSAGE");
  }
  //Serial.println("This is dead");
  delay(100);
}





////#include <ArduinoJson.h>
//
//
//#include <Wire.h>
//#include <Adafruit_MotorShield.h>
//#include "utility/Adafruit_MS_PWMServoDriver.h"
//#include <Bridge.h>
//#include <Mailbox.h>
//
//#define MAX_SIZE 200

//
//// how many dist units to one tic
#define UNIT_TICKS 30
//// how many ticks to a degree of spin:
#define SPIN_TICKS 5
//
#define MAX_MESSAGE_SZ 128
//
#define L_SENSOR 5
#define R_SENSOR 6

#define SENSOR_L 7
#define SENSOR_R 8

//
//
//default opens on port 5555
////need the server so the site can get its location, send commands
//BridgeServer server;
//
////navigation:
//String directions;
////matrix for easy movement detection:
const int QEM [16] = {0, -1, 1, 0, 1, 0, 0, -1, -1, 0, 0, 1, 0, 1, -1, 0};
////values from 0 to 360: in degrees
int heading = 0;
//byte curLocation;
//
int spinTicks = SPIN_TICKS;

void goForward(int distance) {
  int totalTicks = 0;
  int goalDist = distance * UNIT_TICKS;
  Serial.println("Forward move:");
  Serial.println(goalDist);
  //noInterrupts();
  fLMotor->run(BACKWARD);
  fRMotor->run(FORWARD);
  //wait:
  while ((totalTicks += getChangeL()) < goalDist) { }

  fLMotor->run(RELEASE);
  fRMotor->run(RELEASE);
}


void spin(int newHeading) {
  int goalTicks = abs(newHeading);
  goalTicks *= spinTicks;
  int totalTicks = 0;
  Serial.print("Ticks to move");
  Serial.println(goalTicks);
  //calc which direction to spin:
  if (newHeading < 0) {
    //noInterrupts();
    Serial.println("Clockwise");
    //right forward, left back
    fLMotor->run(FORWARD);
    fRMotor->run(FORWARD);
    while ((totalTicks += getChangeR()) < goalTicks) { Serial.println(totalTicks); }
  } else {
    //noInterrupts()
    //right back, left forward
    Serial.println("CounterClockwise");
    fLMotor->run(BACKWARD);
    fRMotor->run(BACKWARD);
    //    bLMotor->run(BACKWARD);
    //    bRMotor->run(FORWARD);
    while ((totalTicks += getChangeL()) < goalTicks) { }
  }

  

  fLMotor->run(RELEASE);
  fRMotor->run(RELEASE);
  //  bLMotor->run(RELEASE);
  //  bRMotor->run(RELEASE);
  //interrupts();
  heading = newHeading;
  Serial.print("Heading: ");
  Serial.println(heading);
}

int getChangeR() {
  static int old = 0;
  static int newVal = 0;
  old = newVal;
  newVal = digitalRead (SENSOR_R) * 2 + digitalRead (SENSOR_L); // Convert binary input to decimal value;
  return QEM [old * 4 + newVal];
}

#pragma GCC optimize("O3")
int getChangeL() {
  static int old = 0;
  static int newVal = 0;
  old = newVal;
  newVal = digitalRead (R_SENSOR) * 2 + digitalRead (L_SENSOR); // Convert binary input to decimal value;
  return QEM [old * 4 + newVal];
}
