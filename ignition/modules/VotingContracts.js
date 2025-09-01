import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VotingContracts", (m) => {
    // Parameters for the voting contracts
    const description = m.getParameter("description", "Should we implement FHEVM in our next project?");
    const encryptedDescription = m.getParameter("encryptedDescription", "Should we implement FHEVM in our next project? (Encrypted)");
    const votingDurationMinutes = m.getParameter("votingDurationMinutes", 60);

    // Deploy SimpleVoting contract
    const simpleVoting = m.contract("SimpleVoting", [description, votingDurationMinutes]);

    // Deploy EncryptedSimpleVoting contract
    const encryptedVoting = m.contract("EncryptedSimpleVoting", [encryptedDescription, votingDurationMinutes]);

    return {
        simpleVoting,
        encryptedVoting,
    };
});