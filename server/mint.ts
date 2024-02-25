import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  ExtensionType,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
  createInitializeMetadataPointerInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  createInitializeMintInstruction,
  getMintLen,
  mintTo,
  getTokenMetadata,
} from "@solana/spl-token";
import {
  TokenMetadata,
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
} from "@solana/spl-token-metadata";
import {
  PublicKey,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";


async function createJsonBlob(data: Object, url: string = "https://jsonblob.com/api/jsonBlob") {
    const response = await fetch(url, {
        method: 'POST', // Specify the request method
        headers: {
            'Content-Type': 'application/json', // Indicate we're sending JSON data
            'Accept': 'application/json' // Indicate we expect JSON data in response
        },
        body: JSON.stringify(data) // Convert the JavaScript object to a JSON string
    });

    if (!response.ok) {
        // If the response has an HTTP status code indicating an error, throw an error
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Retrieve the Location header from the response, which contains the URL of the created JSON blob
    const locationUrl = response.headers.get('Location');
    
    return {
        data: await response.json(), // Parse the JSON response body
        locationUrl // Return the URL from the Location header
    };
}

async function mintAndRewardNFT(
  connection: Connection,
  payer: Keypair,
  recipientPublicKey: PublicKey,
  data: Object,
) {
  const mint = Keypair.generate();
  console.log("mint:", mint.publicKey.toBase58());

  const metaDataUrl = await createJsonBlob(data).then(({ data, locationUrl }) => {return locationUrl;})


  // define our custom metadata for our token
  const metadata: TokenMetadata = {
    mint: mint.publicKey,
    name: "Hooray, HackIllinois!",
    symbol: "HHI",
    uri: metaDataUrl || "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
    additionalMetadata: [
      ["note", "you win the story game!"],
    ],
  };

  // calculate the space required for our onchain metadata
  const metadataSpace = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

  // calculate the space required to allocate the mint account
  const mintSpace = getMintLen([ExtensionType.MetadataPointer]);

  // ask the blockchain how many lamports we need to pay
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintSpace + metadataSpace,
  );

  // allocate the mint's account state on chain
  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    // note: the mint's space must be exact and should not
    // include the variable length metadata space
    space: mintSpace,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  // add the metadata pointer, setting our mint as our metadata account
  const initializeMetadataPointerIx =
    createInitializeMetadataPointerInstruction(
      mint.publicKey,
      payer.publicKey,
      mint.publicKey,
      TOKEN_2022_PROGRAM_ID,
    );

  // initialize the actual mint account
  const initializeMintIx = createInitializeMintInstruction(
    mint.publicKey,
    0, // decimals
    payer.publicKey,
    null,
    TOKEN_2022_PROGRAM_ID,
  );

  // initialize the actual metadata on the mint
  const initializeMetadataIx = createInitializeInstruction({
    mint: mint.publicKey,
    metadata: mint.publicKey,
    mintAuthority: payer.publicKey,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: payer.publicKey,
  });

  const transaction = new Transaction().add(
    createAccountIx,
    initializeMetadataPointerIx,
    initializeMintIx,
    // these instructions are required to be after initializing the mint
    initializeMetadataIx,
  );

  console.log("\nSending transaction...");

  // actually send the transaction to create our token
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
    mint,
  ]);
  const chainMetadata = await getTokenMetadata(connection, mint.publicKey);

  console.log("\nMetadata:", JSON.stringify(chainMetadata, null, 2));

  // console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log(`https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
  console.log(
    `https://solana.fm/address/${mint.publicKey.toBase58()}?cluster=devnet-alpha`,
  );

  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint.publicKey,
    recipientPublicKey,
    undefined,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  console.log("recTokenAccount: ", recipientTokenAccount);

  const mintSig = await mintTo(
    connection,
    payer,
    mint.publicKey,
    recipientTokenAccount.address,
    payer,
    1, // amount, 1 for NFT
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  console.log(`https://solana.fm/tx/${mintSig}?cluster=devnet-alpha`);
  return `https://solana.fm/tx/${mintSig}?cluster=devnet-alpha`;
}


export default async function mint(recipientKey: string, data: Object) {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = await getKeypairFromFile("~/.config/solana/id.json");
  const metadataUri = "https://example.com/path/to/nft/metadata.json";
  const recipientPublicKey = new PublicKey(recipientKey);
  return await mintAndRewardNFT(connection, payer, recipientPublicKey, data);
}

// (async () => {
//   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//   const payer = await getKeypairFromFile("~/.config/solana/id.json");
//   const metadataUri = "https://example.com/path/to/nft/metadata.json";
//   const recipientPublicKey = new PublicKey(
//     "DZCs1ynLtiX9wAe5orchGqG1bQjLPS8g4xKHeC5ZPMSb",
//   );
//   await mintAndRewardNFT(connection, payer, recipientPublicKey, metadataUri);
// })();
