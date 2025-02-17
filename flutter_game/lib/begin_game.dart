
import 'dart:async';
import 'dart:math';
import 'dart:js' as js;

import 'package:flutter/material.dart';

void sendMessageToReactNative(String message) {
  final reactNativeWebView = js.context['ReactNativeWebView'];
  if (reactNativeWebView != null) {
    reactNativeWebView.callMethod('postMessage', [message]);
  } else {
    js.context.callMethod('eval', ['window.parent.postMessage("$message", "*");']);
  }
}

class BeginGame extends StatefulWidget {
  const BeginGame({super.key});

  @override
  State<BeginGame> createState() => _BeginGameState();
}

class _BeginGameState extends State<BeginGame> {
  List<Color> colors = List.generate(16, (index) => Colors.white);
  List<int> rightOrder = [];
  List<int> redOrder = [];
  List<int> greenOrder = [];
  List<int> userSequence = [];
  List<int> greySquares = [];
  int stmThreshold = 5;
  int pairsLightUp = 0;
  int mistakes = 0;
  int atMistakes = 0;
  bool sequenceCompleted = false;
  bool firstGame = true;
  bool finishedShowingSequence = false;
  late Timer timer;
  late DateTime startTime;
  late DateTime delayTimeStart = DateTime.now();
  double delayTime = 0.0;
  List<double> reactionTimes = [];
  double totalReactionTime = 0.0;
  double reactionTime = 0.0;
  double averageReactionTime = 0.0;
  int gamesPlayed = 0;

  bool showGuide = false;
  bool showResults = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  void startTimer() async {
    rightOrder = List.generate(stmThreshold, (_) => 0);
    redOrder = List.generate(stmThreshold, (_) => 0);
    greenOrder = List.generate(stmThreshold, (_) => 0);

    int randomInterval = Random().nextInt(1000) + 1500;

    timer = Timer.periodic(Duration(milliseconds: randomInterval), (Timer t) {
      if (pairsLightUp < stmThreshold) {
        setState(() {
          colors = List.generate(16, (index) => Colors.white);
          int randomSquare1 = Random().nextInt(16);
          int randomSquare2, randomSquare3;

          do {
            randomSquare2 = Random().nextInt(16);
          } while (randomSquare1 == randomSquare2);

          do {
            randomSquare3 = Random().nextInt(16);
          } while (randomSquare1 == randomSquare3 || randomSquare2 == randomSquare3);

          colors[randomSquare1] = Colors.blue;
          colors[randomSquare2] = Colors.red;
          colors[randomSquare3] = Colors.green;
          rightOrder[pairsLightUp] = randomSquare1;
          redOrder[pairsLightUp] = randomSquare2;
          greenOrder[pairsLightUp] = randomSquare3;
          startTime = DateTime.now();
        });
        pairsLightUp += 1;
      } else {
        Future.delayed(const Duration(seconds: 1), () {
          setState(() {
            colors = List.generate(16, (index) => Colors.white);
            finishedShowingSequence = true;
          });
        });
        t.cancel();
      }
    });
  }

  void addReactionTime(double time) {
    setState(() {
      reactionTimes.add(time);
      totalReactionTime += time;
    });
  }

  void calculateAverageReactionTime() {
    if (reactionTimes.length > 3) {
      List<double> sortedTimes = List.from(reactionTimes);
      sortedTimes.sort();
      double sumFastestThree = sortedTimes.take(3).reduce((a, b) => a + b);
      averageReactionTime = sumFastestThree / 3;
    } else {
      averageReactionTime = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
    }
  }

  void saveUserData(double averageReactionTime, int mistakes) async {
    DateTime now = DateTime.now();

    Map<String, dynamic> gameData = {
      'average_reaction_time': averageReactionTime,
      'mistakes': mistakes,
      'at_mistakes': atMistakes,
      'timestamp': now,
      'sequence_length': stmThreshold,
    };

    int newSequenceLength;
    if (mistakes >= stmThreshold / 2 && stmThreshold > 4) {
      newSequenceLength = stmThreshold - 1;
    } else if (mistakes == 0 && stmThreshold < 9) {
      newSequenceLength = stmThreshold + 1;
    } else {
      newSequenceLength = stmThreshold;
    }

    sendMessageToReactNative(gameData.toString());

    Map<String, dynamic> userProgressData = {
      'new_sequence_length': newSequenceLength,
      'games_played': gamesPlayed + 1,
    };
    sendMessageToReactNative(userProgressData.toString());
  }

  void checkSequence() {
    if (!sequenceCompleted) {
      setState(() {
        for (int i = 0; i < userSequence.length; i++) {
          if (userSequence[i] == redOrder[i] || userSequence[i] == greenOrder[i]) {
            atMistakes++;
          }
          if (userSequence[i] != rightOrder[i]) {
            mistakes++;
          }
        }
        sequenceCompleted = true;
        calculateAverageReactionTime();
        saveUserData(averageReactionTime, mistakes);
        showResults = true;
      });
    }
  }

  void resetGame() {
    setState(() {
      showResults = false;
      pairsLightUp = 0;
      mistakes = 0;
      atMistakes = 0;
      sequenceCompleted = false;
      finishedShowingSequence = false;
      firstGame = false;
      userSequence.clear();
      greySquares.clear();
      reactionTime = 0.0;
      averageReactionTime = 0.0;
      totalReactionTime = 0.0;
      reactionTimes.clear();
      rightOrder.clear();
      redOrder.clear();
      greenOrder.clear();
    });
    startTimer();
  }

  void toggleGuide() {
    setState(() {
      showGuide = !showGuide;
      if (!firstGame) {
        showResults = !showResults;
      }
    });
  }

  Widget buildGuideWidget() {
    if (showGuide) {
      return Container(
        padding: const EdgeInsets.all(16),
        color: Colors.grey[200],
        child: RichText(
          text: const TextSpan(
            style: TextStyle(fontSize: 16, color: Colors.black),
            children: <TextSpan>[
              TextSpan(text: "How to Play:\n\n"),
              TextSpan(text: "1. Memorize the Sequence:", style: TextStyle(fontWeight: FontWeight.bold)),
              TextSpan(text: " Watch carefully as a series of "),
              TextSpan(text: "blue", style: TextStyle(color: Colors.blue)),
              TextSpan(text: " squares light up on the screen. These squares indicate the sequence you need to remember. Pay close attention to the order in which they appear.\n"),
              TextSpan(text: "2. Quick Response:", style: TextStyle(fontWeight: FontWeight.bold)),
              TextSpan(text: " Once a new set of three squares lights up, quickly tap"),
              TextSpan(text: " anywhere on the playing field.", style: TextStyle(fontWeight: FontWeight.bold)),
              TextSpan(text: " This step tests your reflexes and the speed of your response.\n"),
              TextSpan(text: "3. Recreate the Sequence:", style: TextStyle(fontWeight: FontWeight.bold)),
              TextSpan(text: " After the entire sequence of "),
              TextSpan(text: "blue", style: TextStyle(color: Colors.blue)),
              TextSpan(text: " squares has been shown, begin tapping the squares in the exact order they were illuminated. This part of the game assesses your memory and ability to recall the sequence correctly.\n"),
              TextSpan(text: "4. Minimize Errors:", style: TextStyle(fontWeight: FontWeight.bold)),
              TextSpan(text: " Attempt to replicate the sequence as accurately as possible.\n"),
              TextSpan(text: "5. Have fun!", style: TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      );
    } else {
      return Container(); // Return an empty container if the guide is not to be shown
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Color Sequence Game",
          style: TextStyle(color: Colors.black87),
        ),
        backgroundColor: Colors.blue[200], // Lighter background color
        elevation: 0, // No shadow
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: Container(
          color: Colors.grey[200], // Light grey background color
          constraints: BoxConstraints(
            maxWidth: 650, // Increase the maximum width
            maxHeight: 650, // Increase the maximum height
          ),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: LayoutBuilder(
                  builder: (context, constraints) {
                    int crossAxisCount = 4; // 4 columns for 4x4 grid
                    double itemSize = constraints.maxWidth / crossAxisCount;
                    return GridView.builder(
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: crossAxisCount,
                        mainAxisSpacing: 4.0,
                        crossAxisSpacing: 4.0,
                        childAspectRatio: 1.0, // Ensures that the grid items are square
                      ),
                      itemCount: 16,
                      itemBuilder: (context, index) {
                        bool isPressed = greySquares.contains(index);
                        Color bgColor = isPressed ? Colors.grey[300]! : colors[index];
                        return GestureDetector(
                          child: (!sequenceCompleted && finishedShowingSequence)
                              ? AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  color: bgColor,
                                  margin: const EdgeInsets.all(4),
                                )
                              : Container(
                                  color: bgColor,
                                  margin: const EdgeInsets.all(4),
                                ),
                          onTap: () {
                            delayTimeStart = DateTime.now();
                            if (!finishedShowingSequence) {
                              DateTime endTime = DateTime.now();
                              reactionTime = endTime.difference(startTime).inMilliseconds / 1000;
                              addReactionTime(reactionTime);
                            }
                            if (!sequenceCompleted && finishedShowingSequence) {
                              setState(() {
                                userSequence.add(index);
                                greySquares.add(index);
                                if (userSequence.length == rightOrder.length) {
                                  checkSequence();
                                }

                                Future.delayed(const Duration(milliseconds: 500), () {
                                  setState(() {
                                    greySquares.remove(index);
                                  });
                                });
                              });
                            }
                          },
                        );
                      },
                    );
                  },
                ),
              ),
              buildGuideWidget(),
              if (showResults)
                Column(
                  children: [
                    Text("Mistakes: $mistakes", style: const TextStyle(fontSize: 20)),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: resetGame,
                      child: const Text("Restart", style: TextStyle(fontSize: 18)),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      "Your average reaction time: ${averageReactionTime.toStringAsFixed(1)}ms",
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              if (!sequenceCompleted && firstGame)
                Column(
                  children: [
                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          firstGame = false;
                        });
                        startTimer();
                      },
                      child: const Text('Start Game', style: TextStyle(fontSize: 18)),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: toggleGuide,
        child: const Icon(Icons.help),
      ),
    );
  }
}

