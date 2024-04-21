import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { assert } from "chai";

describe("counter", () => {
  
  const provider = anchor.AnchorProvider.local()
  
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;

  const counter = anchor.web3.Keypair.generate();

  it("Creates a counter", async () => {
    await program.methods.create()
    .accounts({
      counter: counter.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([counter])
    .rpc();

    let counterAccount = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterAccount.count.eq(new anchor.BN(0)));
  });

  it("Increments the counter", async () => {
    await program.methods.increment()
    .accounts({
      counter: counter.publicKey
    })
    // .signers([counter])
    .rpc();

    let counterAccount = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterAccount.count.eq(new anchor.BN(1)));
  });

  it("Decrements the counter", async () => {
    await program.methods.decrement()
    .accounts({
      counter: counter.publicKey
    })
    // .signers([counter])
    .rpc();

    let counterAccount = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterAccount.count.eq(new anchor.BN(0)));
  });

  it("Decrements the counter at 0", async () => {
    await program.methods.decrement()
    .accounts({
      counter: counter.publicKey
    })
    // .signers([counter])
    .rpc();

    let counterAccount = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterAccount.count.eq(new anchor.BN(0)));
  });

  it("Sets the counter to 100", async () => {
    await program.methods.set(new anchor.BN(100))
    .accounts({
      counter: counter.publicKey
    })
    // .signers([counter])
    .rpc();

    let counterAccount = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterAccount.count.eq(new anchor.BN(100)));
  });
});
