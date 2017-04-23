//#include <ArduinoJson.h>


#include <Wire.h>
#include <Adafruit_MotorShield.h>
#include "utility/Adafruit_MS_PWMServoDriver.h"
#include <Bridge.h>
//#include <BridgeServer.h>
//#include <BridgeClient.h>
#include <Mailbox.h>

#define MAX_SIZE 200
#define MOTOR_SPEED 150

// how many dist units to one tic
#define UNIT_TICKS 20
// how many ticks to a degree of spin:
#define SPIN_TICKS 2

#define MAX_MESSAGE_SZ 50

#define L_SENSOR 5
#define R_SENSOR 6 

Adafruit_MotorShield AFMS = Adafruit_MotorShield(); 
Adafruit_DCMotor *fLMotor = AFMS.getMotor(1);
Adafruit_DCMotor *fRMotor = AFMS.getMotor(2);
//Adafruit_DCMotor *bRMotor = AFMS.getMotor(3);
//Adafruit_DCMotor *bLMotor = AFMS.getMotor(4);


//default opens on port 5555
//need the server so the site can get its location, send commands
//BridgeServer server;

//navigation:
String directions;
//matrix for easy movement detection:
const int QEM [16] = {0,-1,1,0,1,0,0,-1,-1,0,0,1,0,1,-1,0};
//values from 0 to 360: in degrees
int heading = 0;
byte curLocation;

int spinTicks = SPIN_TICKS;

void setup() {
  // put your setup code here, to run once:
  //Bridge.begin();
  Serial.begin(9600);
  //Mailbox.begin();
//  server.listenOnLocalhost();
//  server.begin();
  AFMS.begin();

  fLMotor->setSpeed(MOTOR_SPEED);
  fRMotor->setSpeed(MOTOR_SPEED);
//  bLMotor->setSpeed(MOTOR_SPEED);
//  bRMotor->setSpeed(MOTOR_SPEED);
}

void loop() {
  processCommand();
  delay(500);
}

inline void processCommand() {
  if(Serial.available()) {

    spinTicks = Serial.parseInt();
    int distance = Serial.parseInt();
    if(spinTicks == 0) {
      heading = 0;
      Serial.println("RESET");
    } else {
    Serial.parseInt();
    Serial.print("Going forward: ");
    Serial.println(distance);
    Serial.print("Ticks: ");
    Serial.println(spinTicks);
    spin(distance);
    }
  }
//  if(Mailbox.messageAvailable()) {
//    unsigned char message[MAX_MESSAGE_SZ];
//    Mailbox.readMessage(message, MAX_MESSAGE_SZ);
//    spin(35);
//    goForward(45);
//    char buf[2];
//    sprintf(buf, "%d", curLocation);
//    Bridge.put("location", buf);
//  }
}


//void processCommand() {
//  BridgeClient client = server.accept();
//  if(client) {
//    String command = client.readStringUntil('/');
//    command.trim();
//    if(command == "location") {
//      client.print(curLocation);
//    } else if(command == "go") {
//      char * directions = client.readString().c_str();
//      spin(5);
//      goForward(100);
//    }
//   client.stop(); 
//  }
//}

void goForward(int distance) {
  int totalTicks = 0;
  int goalDist = distance * UNIT_TICKS;
  //noInterrupts();
  fLMotor->run(BACKWARD);
  fRMotor->run(FORWARD);
//  bLMotor->run(FORWARD);
//  bRMotor->run(FORWARD);
  //interrupts();
  //wait:
  while((totalTicks += getChange()) < goalDist) { }
  
  fLMotor->run(RELEASE);
  fRMotor->run(RELEASE);
//  bLMotor->run(RELEASE);
//  bRMotor->run(RELEASE);
  //interrupts();
}


void spin(int newHeading) {
  int totalTicks = 0;
  int goalTicks = newHeading - heading;
  goalTicks *= spinTicks;
  Serial.print("Ticks to move");
  Serial.println(goalTicks);
  //calc which direction to spin:
  if(goalTicks < 0) { 
    goalTicks *= -1;
    //noInterrupts();
    Serial.println("Clockwise");
    //right forward, left back
    fLMotor->run(FORWARD);
    fRMotor->run(FORWARD);
//    bLMotor->run(BACKWARD);
//    bRMotor->run(FORWARD);
  } else {
    //noInterrupts();
    //right back, left forward 
    Serial.println("CounterClockwise");
    fLMotor->run(BACKWARD);
    fRMotor->run(BACKWARD);
//    bLMotor->run(BACKWARD);
//    bRMotor->run(FORWARD);
  }
  
  while((totalTicks += getChange()) < goalTicks) { }
  
  fLMotor->run(RELEASE);
  fRMotor->run(RELEASE);
//  bLMotor->run(RELEASE);
//  bRMotor->run(RELEASE);
  //interrupts();
  heading = newHeading;
  Serial.print("Heading: ");
  Serial.println(heading);
}

#pragma GCC optimize("O3")
int getChange() {
  static int old = 0;
  static int newVal = 0;
  old = newVal;
  newVal = digitalRead (R_SENSOR) * 2 + digitalRead (L_SENSOR); // Convert binary input to decimal value;
  return QEM [old * 4 + newVal];
}
