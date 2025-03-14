const e=JSON.parse('[{"type":"function","name":"DEFAULT_ADMIN_ROLE","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"approve","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"balanceOf","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"burn","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"claim","inputs":[{"name":"_receiver","type":"address","internalType":"address"},{"name":"_quantity","type":"uint256","internalType":"uint256"},{"name":"_currency","type":"address","internalType":"address"},{"name":"_pricePerToken","type":"uint256","internalType":"uint256"},{"name":"_allowlistProof","type":"tuple","internalType":"struct IDropSinglePhase_V1.AllowlistProof","components":[{"name":"proof","type":"bytes32[]","internalType":"bytes32[]"},{"name":"maxQuantityInAllowlist","type":"uint256","internalType":"uint256"}]},{"name":"_data","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"claimCondition","inputs":[],"outputs":[{"name":"startTimestamp","type":"uint256","internalType":"uint256"},{"name":"maxClaimableSupply","type":"uint256","internalType":"uint256"},{"name":"supplyClaimed","type":"uint256","internalType":"uint256"},{"name":"quantityLimitPerTransaction","type":"uint256","internalType":"uint256"},{"name":"waitTimeInSecondsBetweenClaims","type":"uint256","internalType":"uint256"},{"name":"merkleRoot","type":"bytes32","internalType":"bytes32"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"contractType","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"pure"},{"type":"function","name":"contractURI","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"contractVersion","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"pure"},{"type":"function","name":"eip712Domain","inputs":[],"outputs":[{"name":"fields","type":"bytes1","internalType":"bytes1"},{"name":"name","type":"string","internalType":"string"},{"name":"version","type":"string","internalType":"string"},{"name":"chainId","type":"uint256","internalType":"uint256"},{"name":"verifyingContract","type":"address","internalType":"address"},{"name":"salt","type":"bytes32","internalType":"bytes32"},{"name":"extensions","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"encryptDecrypt","inputs":[{"name":"data","type":"bytes","internalType":"bytes"},{"name":"key","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"result","type":"bytes","internalType":"bytes"}],"stateMutability":"pure"},{"type":"function","name":"encryptedData","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bytes","internalType":"bytes"}],"stateMutability":"view"},{"type":"function","name":"getApproved","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getBaseURICount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getBatchIdAtIndex","inputs":[{"name":"_index","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getClaimTimestamp","inputs":[{"name":"_claimer","type":"address","internalType":"address"}],"outputs":[{"name":"lastClaimedAt","type":"uint256","internalType":"uint256"},{"name":"nextValidClaimTimestamp","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getDefaultRoyaltyInfo","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint16","internalType":"uint16"}],"stateMutability":"view"},{"type":"function","name":"getFlatPlatformFeeInfo","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getPlatformFeeInfo","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint16","internalType":"uint16"}],"stateMutability":"view"},{"type":"function","name":"getPlatformFeeType","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"enum IPlatformFee.PlatformFeeType"}],"stateMutability":"view"},{"type":"function","name":"getRevealURI","inputs":[{"name":"_batchId","type":"uint256","internalType":"uint256"},{"name":"_key","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"revealedURI","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"getRoleAdmin","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"getRoleMember","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"index","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"member","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getRoleMemberCount","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"count","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getRoyaltyInfoForToken","inputs":[{"name":"_tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint16","internalType":"uint16"}],"stateMutability":"view"},{"type":"function","name":"grantRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"hasRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"hasRoleWithSwitch","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"initialize","inputs":[{"name":"_defaultAdmin","type":"address","internalType":"address"},{"name":"_name","type":"string","internalType":"string"},{"name":"_symbol","type":"string","internalType":"string"},{"name":"_contractURI","type":"string","internalType":"string"},{"name":"_trustedForwarders","type":"address[]","internalType":"address[]"},{"name":"_saleRecipient","type":"address","internalType":"address"},{"name":"_royaltyRecipient","type":"address","internalType":"address"},{"name":"_royaltyBps","type":"uint128","internalType":"uint128"},{"name":"_platformFeeBps","type":"uint128","internalType":"uint128"},{"name":"_platformFeeRecipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"isApprovedForAll","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"operator","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"isEncryptedBatch","inputs":[{"name":"_batchId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"isTrustedForwarder","inputs":[{"name":"forwarder","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"lazyMint","inputs":[{"name":"_amount","type":"uint256","internalType":"uint256"},{"name":"_baseURIForTokens","type":"string","internalType":"string"},{"name":"_data","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"batchId","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"mintWithSignature","inputs":[{"name":"_req","type":"tuple","internalType":"struct ISignatureMintERC721.MintRequest","components":[{"name":"to","type":"address","internalType":"address"},{"name":"royaltyRecipient","type":"address","internalType":"address"},{"name":"royaltyBps","type":"uint256","internalType":"uint256"},{"name":"primarySaleRecipient","type":"address","internalType":"address"},{"name":"uri","type":"string","internalType":"string"},{"name":"quantity","type":"uint256","internalType":"uint256"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"},{"name":"validityStartTimestamp","type":"uint128","internalType":"uint128"},{"name":"validityEndTimestamp","type":"uint128","internalType":"uint128"},{"name":"uid","type":"bytes32","internalType":"bytes32"}]},{"name":"_signature","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"signer","type":"address","internalType":"address"}],"stateMutability":"payable"},{"type":"function","name":"multicall","inputs":[{"name":"data","type":"bytes[]","internalType":"bytes[]"}],"outputs":[{"name":"results","type":"bytes[]","internalType":"bytes[]"}],"stateMutability":"nonpayable"},{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"nextTokenIdToMint","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"ownerOf","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"primarySaleRecipient","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"renounceRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"reveal","inputs":[{"name":"_index","type":"uint256","internalType":"uint256"},{"name":"_key","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"revealedURI","type":"string","internalType":"string"}],"stateMutability":"nonpayable"},{"type":"function","name":"revokeRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"royaltyInfo","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"salePrice","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"receiver","type":"address","internalType":"address"},{"name":"royaltyAmount","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"safeTransferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"safeTransferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"_data","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setApprovalForAll","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"approved","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setClaimConditions","inputs":[{"name":"_condition","type":"tuple","internalType":"struct IClaimCondition_V1.ClaimCondition","components":[{"name":"startTimestamp","type":"uint256","internalType":"uint256"},{"name":"maxClaimableSupply","type":"uint256","internalType":"uint256"},{"name":"supplyClaimed","type":"uint256","internalType":"uint256"},{"name":"quantityLimitPerTransaction","type":"uint256","internalType":"uint256"},{"name":"waitTimeInSecondsBetweenClaims","type":"uint256","internalType":"uint256"},{"name":"merkleRoot","type":"bytes32","internalType":"bytes32"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"}]},{"name":"_resetClaimEligibility","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setContractURI","inputs":[{"name":"_uri","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setDefaultRoyaltyInfo","inputs":[{"name":"_royaltyRecipient","type":"address","internalType":"address"},{"name":"_royaltyBps","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setFlatPlatformFeeInfo","inputs":[{"name":"_platformFeeRecipient","type":"address","internalType":"address"},{"name":"_flatFee","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setOwner","inputs":[{"name":"_newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setPlatformFeeInfo","inputs":[{"name":"_platformFeeRecipient","type":"address","internalType":"address"},{"name":"_platformFeeBps","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setPlatformFeeType","inputs":[{"name":"_feeType","type":"uint8","internalType":"enum IPlatformFee.PlatformFeeType"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setPrimarySaleRecipient","inputs":[{"name":"_saleRecipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setRoyaltyInfoForToken","inputs":[{"name":"_tokenId","type":"uint256","internalType":"uint256"},{"name":"_recipient","type":"address","internalType":"address"},{"name":"_bps","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"tokenURI","inputs":[{"name":"_tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"totalMinted","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"transferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"verify","inputs":[{"name":"_req","type":"tuple","internalType":"struct ISignatureMintERC721.MintRequest","components":[{"name":"to","type":"address","internalType":"address"},{"name":"royaltyRecipient","type":"address","internalType":"address"},{"name":"royaltyBps","type":"uint256","internalType":"uint256"},{"name":"primarySaleRecipient","type":"address","internalType":"address"},{"name":"uri","type":"string","internalType":"string"},{"name":"quantity","type":"uint256","internalType":"uint256"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"},{"name":"validityStartTimestamp","type":"uint128","internalType":"uint128"},{"name":"validityEndTimestamp","type":"uint128","internalType":"uint128"},{"name":"uid","type":"bytes32","internalType":"bytes32"}]},{"name":"_signature","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"success","type":"bool","internalType":"bool"},{"name":"signer","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"verifyClaim","inputs":[{"name":"_claimer","type":"address","internalType":"address"},{"name":"_quantity","type":"uint256","internalType":"uint256"},{"name":"_currency","type":"address","internalType":"address"},{"name":"_pricePerToken","type":"uint256","internalType":"uint256"},{"name":"verifyMaxQuantityPerTransaction","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"view"},{"type":"function","name":"verifyClaimMerkleProof","inputs":[{"name":"_claimer","type":"address","internalType":"address"},{"name":"_quantity","type":"uint256","internalType":"uint256"},{"name":"_allowlistProof","type":"tuple","internalType":"struct IDropSinglePhase_V1.AllowlistProof","components":[{"name":"proof","type":"bytes32[]","internalType":"bytes32[]"},{"name":"maxQuantityInAllowlist","type":"uint256","internalType":"uint256"}]}],"outputs":[{"name":"validMerkleProof","type":"bool","internalType":"bool"},{"name":"merkleProofIndex","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"event","name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"approved","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ApprovalForAll","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"operator","type":"address","indexed":true,"internalType":"address"},{"name":"approved","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false},{"type":"event","name":"ClaimConditionUpdated","inputs":[{"name":"condition","type":"tuple","indexed":false,"internalType":"struct IClaimCondition_V1.ClaimCondition","components":[{"name":"startTimestamp","type":"uint256","internalType":"uint256"},{"name":"maxClaimableSupply","type":"uint256","internalType":"uint256"},{"name":"supplyClaimed","type":"uint256","internalType":"uint256"},{"name":"quantityLimitPerTransaction","type":"uint256","internalType":"uint256"},{"name":"waitTimeInSecondsBetweenClaims","type":"uint256","internalType":"uint256"},{"name":"merkleRoot","type":"bytes32","internalType":"bytes32"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"}]},{"name":"resetEligibility","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false},{"type":"event","name":"ContractURIUpdated","inputs":[{"name":"prevURI","type":"string","indexed":false,"internalType":"string"},{"name":"newURI","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"DefaultRoyalty","inputs":[{"name":"newRoyaltyRecipient","type":"address","indexed":true,"internalType":"address"},{"name":"newRoyaltyBps","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"EIP712DomainChanged","inputs":[],"anonymous":false},{"type":"event","name":"FlatPlatformFeeUpdated","inputs":[{"name":"platformFeeRecipient","type":"address","indexed":false,"internalType":"address"},{"name":"flatFee","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Initialized","inputs":[{"name":"version","type":"uint8","indexed":false,"internalType":"uint8"}],"anonymous":false},{"type":"event","name":"OwnerUpdated","inputs":[{"name":"prevOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"PlatformFeeInfoUpdated","inputs":[{"name":"platformFeeRecipient","type":"address","indexed":true,"internalType":"address"},{"name":"platformFeeBps","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"PlatformFeeTypeUpdated","inputs":[{"name":"feeType","type":"uint8","indexed":false,"internalType":"enum IPlatformFee.PlatformFeeType"}],"anonymous":false},{"type":"event","name":"PrimarySaleRecipientUpdated","inputs":[{"name":"recipient","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RoleAdminChanged","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"previousAdminRole","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"newAdminRole","type":"bytes32","indexed":true,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"RoleGranted","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"sender","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RoleRevoked","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"sender","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RoyaltyForToken","inputs":[{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"royaltyRecipient","type":"address","indexed":true,"internalType":"address"},{"name":"royaltyBps","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TokenURIRevealed","inputs":[{"name":"index","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"revealedURI","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"TokensClaimed","inputs":[{"name":"claimer","type":"address","indexed":true,"internalType":"address"},{"name":"receiver","type":"address","indexed":true,"internalType":"address"},{"name":"startTokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"quantityClaimed","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TokensLazyMinted","inputs":[{"name":"startTokenId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"endTokenId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"baseURI","type":"string","indexed":false,"internalType":"string"},{"name":"encryptedBaseURI","type":"bytes","indexed":false,"internalType":"bytes"}],"anonymous":false},{"type":"event","name":"TokensMintedWithSignature","inputs":[{"name":"signer","type":"address","indexed":true,"internalType":"address"},{"name":"mintedTo","type":"address","indexed":true,"internalType":"address"},{"name":"tokenIdMinted","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"mintRequest","type":"tuple","indexed":false,"internalType":"struct ISignatureMintERC721.MintRequest","components":[{"name":"to","type":"address","internalType":"address"},{"name":"royaltyRecipient","type":"address","internalType":"address"},{"name":"royaltyBps","type":"uint256","internalType":"uint256"},{"name":"primarySaleRecipient","type":"address","internalType":"address"},{"name":"uri","type":"string","internalType":"string"},{"name":"quantity","type":"uint256","internalType":"uint256"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"},{"name":"validityStartTimestamp","type":"uint128","internalType":"uint128"},{"name":"validityEndTimestamp","type":"uint128","internalType":"uint128"},{"name":"uid","type":"bytes32","internalType":"bytes32"}]}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ApprovalCallerNotOwnerNorApproved","inputs":[]},{"type":"error","name":"ApprovalQueryForNonexistentToken","inputs":[]},{"type":"error","name":"ApprovalToCurrentOwner","inputs":[]},{"type":"error","name":"ApproveToCaller","inputs":[]},{"type":"error","name":"BalanceQueryForZeroAddress","inputs":[]},{"type":"error","name":"ContractMetadataUnauthorized","inputs":[]},{"type":"error","name":"CurrencyTransferLibFailedNativeTransfer","inputs":[{"name":"recipient","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"DelayedRevealIncorrectResultHash","inputs":[{"name":"expected","type":"bytes32","internalType":"bytes32"},{"name":"actual","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"DelayedRevealNothingToReveal","inputs":[]},{"type":"error","name":"MintToZeroAddress","inputs":[]},{"type":"error","name":"MintZeroQuantity","inputs":[]},{"type":"error","name":"OwnableUnauthorized","inputs":[]},{"type":"error","name":"OwnerQueryForNonexistentToken","inputs":[]},{"type":"error","name":"PermissionsAlreadyGranted","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"role","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"PermissionsInvalidPermission","inputs":[{"name":"expected","type":"address","internalType":"address"},{"name":"actual","type":"address","internalType":"address"}]},{"type":"error","name":"PermissionsUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"neededRole","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"PlatformFeeExceededMaxFeeBps","inputs":[{"name":"max","type":"uint256","internalType":"uint256"},{"name":"actual","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"PlatformFeeInvalidRecipient","inputs":[{"name":"recipient","type":"address","internalType":"address"}]},{"type":"error","name":"PlatformFeeUnauthorized","inputs":[]},{"type":"error","name":"PrimarySaleInvalidRecipient","inputs":[{"name":"recipient","type":"address","internalType":"address"}]},{"type":"error","name":"PrimarySaleUnauthorized","inputs":[]},{"type":"error","name":"RoyaltyExceededMaxFeeBps","inputs":[{"name":"max","type":"uint256","internalType":"uint256"},{"name":"actual","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"RoyaltyInvalidRecipient","inputs":[{"name":"recipient","type":"address","internalType":"address"}]},{"type":"error","name":"RoyaltyUnauthorized","inputs":[]},{"type":"error","name":"SignatureMintInvalidQuantity","inputs":[]},{"type":"error","name":"SignatureMintInvalidRecipient","inputs":[]},{"type":"error","name":"SignatureMintInvalidSigner","inputs":[]},{"type":"error","name":"SignatureMintInvalidTime","inputs":[{"name":"startTime","type":"uint256","internalType":"uint256"},{"name":"endTime","type":"uint256","internalType":"uint256"},{"name":"actualTime","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"SignatureMintUnauthorized","inputs":[]},{"type":"error","name":"TransferCallerNotOwnerNorApproved","inputs":[]},{"type":"error","name":"TransferFromIncorrectOwner","inputs":[]},{"type":"error","name":"TransferToNonERC721ReceiverImplementer","inputs":[]},{"type":"error","name":"TransferToZeroAddress","inputs":[]},{"type":"error","name":"URIQueryForNonexistentToken","inputs":[]}]');export{e as default};
