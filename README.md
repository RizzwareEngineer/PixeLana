# PixeLana
PixeLana is a multiplayer web app game where Stable Diffusion meets the Solana Blockchain. Players will take turns entering a prompt for the rest of the party to utilize the power of Stable Diffusion and generate images based on the prompt. The author of each prompt will then judge and select which art piece is the funniest, prettiest, or best image in the context of the prompt.

Winners will have their art minted in memory and as an NFT on the Solana Blockchain with fast confirmation times and low transaction fees.

Fortunately, PixeLana was awarded a 1st place finish at [HackIllinois 2024](https://hackillinois-2024.devpost.com/)!

> [!NOTE]
> This repository is the final version of our PixeLana submitted to [HackIllinois 2024](https://hackillinois-2024.devpost.com/). 

## What's Next?
PixeLana will be revamped for [Renaissance](https://www.colosseum.org/renaissance), a global online hackathon hosted by the Solana Foundation! 

> [!NOTE]  
> Our production repository for Renaissance is currently private. We will open source [our work here](https://github.com/PixeLana/PixeLana) some time on or after March 21, 2024 to protect ourselves of plagiarism. 

## Try it Out!
We are working fast to deploy our application! For eager players that would like to try the game **on the same network**:

0. Open a terminal, then clone PixeLana using
```
git clone https://github.com/PixeLana/PixeLana.git
```

1. In the same terminal window, run
```
cd PixeLana
npm i
npm run dev
```

2. Open another terminal window, then run
```
cd PixeLana/server
npm i
npm run dev
```

3. Have each player create a Wallet from any of the following providers: 
  - [Phantom](https://phantom.app/)
  - [OKX Wallet](https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge)
  - [Solflare](https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic)

  
4. Have each player **on the same network** access this link: http://localhost:3000/
