// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenStreamer is Ownable, ReentrancyGuard {
    struct Stream {
        address sender;
        address receiver;
        IERC20 token;
        uint256 rate;
        uint256 startTime;
        uint256 endTime;
        uint256 withdrawnAmount;
        uint256 totalAmountToStream;
    }

    uint256 constant USDC_DECIMALS = 1000000;

    mapping(uint256 => Stream) public streams;
    mapping(address => uint256[]) public userCreatedStreamIds;
    mapping(address => uint256[]) public receiverStreamIds;
    uint256 public streamCount;

    event StreamCreated(
        uint256 indexed streamId,
        address indexed sender,
        address indexed receiver,
        address token,
        uint256 rate,
        uint256 startTime,
        uint256 endTime
    );
    event StreamWithdrawn(
        uint256 indexed streamId,
        address indexed receiver,
        uint256 amount
    );

    constructor(
        address _initialOwner
    ) Ownable(_initialOwner) ReentrancyGuard() {}

    //stream rate should be eth/month
    //and there should a duration for which you want the stream to last

    function createStream(
        address receiver,
        IERC20 token,
        uint256 rate, //eth per month, convert into wei/seconds
        uint256 duration, //in seconds,
        uint256 totalAmountToStream
    ) external nonReentrant {
        require(rate > 0, "Rate must be greater than zero");
        require(duration > 0, "Duration must be greater than zero");

        streamCount++;

        uint256 streamId = streamCount;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;

        streams[streamId] = Stream({
            sender: msg.sender,
            receiver: receiver,
            token: token,
            rate: rate,
            startTime: startTime,
            endTime: endTime,
            withdrawnAmount: 0,
            totalAmountToStream: totalAmountToStream
        });

        userCreatedStreamIds[msg.sender].push(streamId);
        receiverStreamIds[receiver].push(streamId);

        streamCount++;

        //uint256 totalAmount = rate * duration;
        token.transferFrom(msg.sender, address(this), totalAmountToStream);

        emit StreamCreated(
            streamId,
            msg.sender,
            receiver,
            address(token),
            rate,
            startTime,
            endTime
        );
    }

    function withdrawFromStream(uint256 streamId) external nonReentrant {
        Stream storage stream = streams[streamId];
        require(
            stream.receiver == msg.sender,
            "Only the receiver can withdraw from the stream"
        );

        uint256 withdrawableAmount = calculateWithdrawableAmount(streamId);
        require(withdrawableAmount > 0, "No withdrawable amount available");

        stream.withdrawnAmount += withdrawableAmount;
        stream.token.transfer(msg.sender, withdrawableAmount);

        emit StreamWithdrawn(streamId, msg.sender, withdrawableAmount);
    }

    function cancelStream(uint256 streamId) external nonReentrant {
        Stream storage stream = streams[streamId];
        require(
            stream.sender == msg.sender,
            "Only the sender can withdraw remaining funds"
        );
        //require(block.timestamp >= stream.endTime, "Stream has not ended yet");

        // uint256 remainingAmount = (stream.rate *
        //     (stream.endTime - stream.startTime)) - stream.withdrawnAmount;

        uint256 remainingAmount = stream.totalAmountToStream - stream.withdrawnAmount;

        require(remainingAmount > 0, "No remaining funds available");

        stream.withdrawnAmount += remainingAmount;
        stream.token.transfer(msg.sender, remainingAmount);

        emit StreamWithdrawn(streamId, msg.sender, remainingAmount);
    }

    function calculateWithdrawableAmount(
        uint256 streamId
    ) public view returns (uint256) {
        Stream storage stream = streams[streamId];

        if (block.timestamp >= stream.endTime) {
            return
                stream.totalAmountToStream - stream.withdrawnAmount;
                // (stream.rate * (stream.endTime - stream.startTime)) -
                // stream.withdrawnAmount;
        } else {
            return
                (stream.rate * (block.timestamp - stream.startTime)) -
                stream.withdrawnAmount;
        }
    }

    function getStreamDetails(
        uint256 _streamId
    ) public view returns (Stream memory) {
        return streams[_streamId];
    }

    function getUserStreamIds(
        address _user
    ) public view returns (uint256[] memory) {
        return userCreatedStreamIds[_user];
    }

    function getReceiverStreamIds(
        address _receiver
    ) public view returns (uint256[] memory) {
        return receiverStreamIds[_receiver];
    }
}
