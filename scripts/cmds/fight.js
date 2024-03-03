const TIMEOUT_SECONDS = 120; // Game timeout duration in seconds, change as per need

// Initialize a Map to track ongoing fights by threadID
const ongoingFights = new Map();
// Initialize a Map to store game instances for each pair
const gameInstances = new Map();

module.exports = {
  config: {
    name: "fight",
    version: "1.0",
    author: "Shikaki",
    countDown: 10,
    role: 0,
    shortDescription: {
      vi: "",
      en: "Fight with your friends!",
    },
    longDescription: {
      vi: "",
      en: "Challenge your friends to a fight and see who wins!",
    },
    category: "🎮 Game",
    guide: "{prefix}fight @mention",
  },

  onStart: async function ({ event, message, api, usersData, args }) {
    const threadID = event.threadID;

    // Check if there's already an ongoing fight in this thread
    if (ongoingFights.has(threadID)) {
      return message.send("⚔ A fight is already in progress in this group.");
    }

    const mention = Object.keys(event.mentions);

    if (mention.length !== 1) {
      return message.send("🤔 𝒄𝒉𝒐𝒊𝒔𝒊𝒕 𝒍𝒆 𝒈𝒖𝒆𝒓𝒓𝒊𝒆𝒓 𝒂 𝒂𝒇𝒇𝒓𝒐𝒏𝒕𝒆𝒓 .");
    }

    const challengerID = event.senderID;
    const opponentID = mention[0];

    const challenger = await usersData.getName(challengerID);
    const opponent = await usersData.getName(opponentID);

    // Create a new fight instance for this pair
    const fight = {
      participants: [],
      currentPlayer: null,
      threadID: threadID,
      startTime: null, // Store the start time
    };

    fight.participants.push({
      id: challengerID,
      name: challenger,
      hp: 100, // Starting HP
    });
    fight.participants.push({
      id: opponentID,
      name: opponent,
      hp: 100, // Starting HP
    });

    // Create a new game instance for this pair
    const gameInstance = {
      fight: fight,
      lastAttack: null,
      lastPlayer: null,
      timeoutID: null, // Store the timeout ID
      turnMessageSent: false, // Keep track of whether the turn message was sent
    };

    // Randomly determine the starting player within the pair
    gameInstance.fight.currentPlayer = Math.random() < 0.5 ? challengerID : opponentID;

    // Add the game instance to the Map
    gameInstances.set(threadID, gameInstance);

    // Start the fight for this pair
    startFight(message, fight);

    // Start the timeout for this game
    startTimeout(threadID, message);
  },

  // Modify the onChat function as follows:
  onChat: async function ({ event, message }) {
    const threadID = event.threadID;

    // Find the ongoing fight for this thread
    const gameInstance = gameInstances.get(threadID);

    if (!gameInstance) return;

    const currentPlayerID = gameInstance.fight.currentPlayer;
    const currentPlayer = gameInstance.fight.participants.find(
      (p) => p.id === currentPlayerID
    );

    const attack = event.body.trim().toLowerCase();

    // Check if the message sender is one of the current players
    const isCurrentPlayer = event.senderID === currentPlayerID;

    // Check if the opponent has attacked already
    if (gameInstance.lastAttack !== null && !isCurrentPlayer) {
      // Inform the current player that it's their opponent's turn
      message.reply(`𝗦𝗣𝗔𝗥𝗜𝗡𝗚🔥\n😒 C'est actuellement le tour de ${currentPlayer.name}. Vous ne pouvez pas attaquer tant qu'ils n'ont pas bougé.`);
      return;
    }

    // Check if the opponent is trying to attack when it's not their turn
    if (!isCurrentPlayer && gameInstance.lastPlayer.id === event.senderID) {
      message.send(`𝗦𝗣𝗔𝗥𝗜𝗡𝗚🔥\n👎 C'est actuellement le tour de ${currentPlayer.name}. Vous ne pouvez pas attaquer tant qu'ils n'ont pas bougé.`);
      return;
    }

    // Check if the message sender is NOT one of the current players
    if (!isCurrentPlayer) {
      // If it's not the current player's turn, prepare the message for the opponent
      if (!gameInstance.turnMessageSent) {
        // Prepare the message, but don't send it yet
        const opponentName = gameInstance.fight.participants.find(p => p.id !== event.senderID).name;
        const turnMessage = `𝗦𝗣𝗔𝗥𝗜𝗡𝗚🔥\nc'est à${currentPlayer.name} de joué.`;
        message.prepare(turnMessage, event.senderID);

        // Remember that the turn message has been sent
        gameInstance.turnMessageSent = true;
      }
      return;
    }

    // Check if the opponent dodged the attack
    if (attack === "forfeit") {
      const forfeiter = currentPlayer.name;
      const opponent = gameInstance.fight.participants.find(
        (p) => p.id !== currentPlayerID
      ).name;
      message.send(`𝗦𝗣𝗔𝗥𝗜𝗡𝗚🔥\n🏃 ${forfeiter} 𝗮 𝗱𝗲́𝗰𝗹𝗮𝗿𝗲́ 𝗳𝗼𝗳𝗮𝗶𝘁! ${opponent} 𝗮𝘀 𝗴𝗮𝗴𝗻𝗲𝗿!`);
      endFight(threadID);
    } else if (["kick", "punch", "slap"].includes(attack)) {
      // Calculate damage (with 10% chance to miss)
      const damage = Math.random() < 0.1 ? 0 : Math.floor(Math.random() * 20 + 10);

      // Apply damage to the opponent
      const opponent = gameInstance.fight.participants.find((p) => p.id !== currentPlayerID);
      opponent.hp -= damage;

      // Display damage dealt message
      message.send(
        `𝗦𝗣𝗔𝗥𝗜𝗡𝗚🔥\n🥊 ${currentPlayer.name} 𝗮𝘁𝘁𝗮𝗾𝘂𝗲 ${opponent.name} 𝗮𝘃𝗲𝗰 ${attack} 𝗲𝘁 ${damage} 𝗽𝗼𝗶𝗻𝘁 𝗱𝗲 𝗱𝗼𝗺𝗮𝗴𝗲.\n\n𝗺𝗮𝗶𝗻𝘁𝗲𝗻𝗮𝗻𝘁, ${opponent.name} 𝗮𝘀 ${opponent.hp} 𝗛P, 𝗲𝘁 ${currentPlayer.name} 𝗮𝘀 ${currentPlayer.hp} 𝗛P.`
      );

      // Check if the game is over
      if (opponent.hp <= 0) {
        const winner = currentPlayer.name;
        const loser = opponent.name;
        message.send(`𝗦𝗣𝗔𝗥𝗜𝗡𝗚🔥\n⏰ 𝘁𝗲𝗺𝗽𝘀 𝗲́𝗰𝗼𝘂𝗹𝗲́! 𝗙𝗶𝗻 𝗱𝘂 𝗰𝗼𝗺𝗯𝗮𝘁. ${winner} 𝗮 𝗴𝗮𝗴𝗻𝗲𝗿! ${loser} 𝗮𝘀 𝗽𝗲𝗿𝗱𝘂.`);
        endFight(threadID);
      } else {
        // Switch turns within the pair
        gameInstance.fight.currentPlayer =
          currentPlayerID === gameInstance.fight.participants[0].id
            ? gameInstance.fight.participants[1].id
            : gameInstance.fight.participants[0].id;
        const newCurrentPlayer = gameInstance.fight.participants.find(p => p.id === gameInstance.fight.currentPlayer);

        // Update last attack and player
        gameInstance.lastAttack = attack;
        gameInstance.lastPlayer = currentPlayer;

        // Reset the turn message status
        gameInstance.turnMessageSent = false;

        // Display whose turn it is now
        message.send(` 𝗦𝗣𝗔𝗥𝗜𝗡𝗚🔥\n𝗰'𝗲𝘀𝘁 𝗹𝗲 𝘁𝗼𝘂𝗿 𝗱𝗲 ${newCurrentPlayer.name}'.`);
      }
    } else {
      message.reply(
        "❌ 𝗹'𝗮𝘁𝘁𝗮𝗾𝘂𝗲 𝗲𝘀𝘁 𝗶𝗻𝘃𝗮𝗹𝗶𝗱𝗲 , 𝘂𝘁𝗶𝗹𝗶𝘀𝗲 'kick', 'punch', 'slap', 𝗼𝘂 'forfeit'."
      );
    }
  },

};

// Function to start a fight
function startFight(message, fight) {
  ongoingFights.set(fight.threadID, fight);

  const currentPlayer = fight.participants.find(p => p.id === fight.currentPlayer);
  const opponent = fight.participants.find(p => p.id !== fight.currentPlayer);

  // List of available attacks
  const attackList = ["kick", "punch", "slap", "forfeit"];

  message.send(
    `𝗦𝗣𝗔𝗥𝗜𝗡𝗚🔥\n【${currentPlayer.name}\n vs\n${opponent.name}】\n\n${currentPlayer.name} a 𝗮 𝗽𝗿𝗼𝘃𝗼𝗾𝘂é  ${opponent.name} 𝗲𝗻 𝗱𝘂𝗲𝗹!\n\n${currentPlayer.name} 𝗮 ${currentPlayer.hp} HP, 𝗲𝘁 ${opponent.name} 𝗮 ${opponent.hp} HP.\n\n𝗰'𝗲𝘀𝘁 𝗹𝗲 𝘁𝗼𝘂𝗿 𝗱𝗲 ${currentPlayer.name}'s .\n\n𝗮𝘁𝘁𝗮𝗾𝘂𝗲𝘀 𝗮 𝗱𝗶𝘀𝗽𝗼𝘀𝗶𝘁𝗶𝗼𝗻: ${attackList.join(', ')}`
  );
}

// Function to start a timeout for a game
function startTimeout(threadID, message) {
  const timeoutID = setTimeout(() => {
    const gameInstance = gameInstances.get(threadID);
    if (gameInstance) {
      const currentPlayer = gameInstance.fight.participants.find(
        (p) => p.id === gameInstance.fight.currentPlayer
      );
      const opponent = gameInstance.fight.participants.find(
        (p) => p.id !== gameInstance.fight.currentPlayer
      );
      const winner = currentPlayer.hp > opponent.hp ? currentPlayer : opponent;
      const loser = currentPlayer.hp > opponent.hp ? opponent : currentPlayer;

      message.send(
        `𝗦𝗣𝗔𝗥𝗜𝗡𝗚🔥\n𝘁𝗲𝗺𝗽𝘀 𝗲́𝗰𝗼𝘂𝗹𝗲𝗿! 𝗟𝗲 𝗷𝗲𝘂𝘅 𝗲𝘀𝘁 𝗳𝗶𝗻𝗶𝘁. ${winner.name} 𝗮 𝗹𝗲 𝗽𝗹𝘂𝘀 𝗱𝗲 HP, 𝗲𝘁 ${winner.name} 𝗮 𝗴𝗮𝗴𝗻𝗲𝗿! ${loser.name} 𝗮𝘀 𝗽𝗲𝗿𝗱𝘂.`
      );

      // End the fight
      endFight(threadID);
    }
  }, TIMEOUT_SECONDS * 1000); // Convert seconds to milliseconds

  // Store the timeout ID in the game instance
  gameInstances.get(threadID).timeoutID = timeoutID;
}

// Function to end a fight and clean up
function endFight(threadID) {
  ongoingFights.delete(threadID);
  // Clear the timeout for this game
  const gameInstance = gameInstances.get(threadID);
  if (gameInstance && gameInstance.timeoutID) {
    clearTimeout(gameInstance.timeoutID);
  }
  // Remove the game instance for this thread
  gameInstances.delete(threadID);
      }
      
