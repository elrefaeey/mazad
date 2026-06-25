import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import UpdateSound from "../../assets/mixkit-magic-marimba-2820.wav";
import { useBidderAuth } from "../../contexts/bidderAuth";
import { LiveBidder } from "../../types/bidders";

function useUnitSocket({ unitId }) {
  const [joinedUnitRoom, setJoinedUnitRoom] = useState(false);
  const [liveTopBidders, setLiveTopBidders] = useState<LiveBidder[]>([]);
  const [showBidNotification, setShowBidNotification] = useState(false);

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isAudioEnabled] = useState(true);
  const { bidder, token } = useBidderAuth();

  const playBidNotificationSound = useCallback(() => {
    if (!isAudioEnabled) {
      return;
    }

    try {
      const audio = new Audio(UpdateSound);
      audio.volume = 1;

      audio
        .play()
        .then(() => {})
        .catch((error) => {
          console.warn("❌ تعذر تشغيل صوت التنبيه:", error);
        });
    } catch (error) {
      console.warn("❌ تعذر تحميل ملف الصوت:", error);
    }
  }, [isAudioEnabled]);

  const showBidNotificationMessage = useCallback((message: string) => {
    setNotificationMessage(message);
    setShowBidNotification(true);
  }, []);

  useEffect(() => {
    if (!unitId || !token || !bidder) {
      console.log("❌ لا يمكن الاتصال بالـ socket - المستخدم غير مسجل دخول");
      setIsSocketConnected(false);
      return;
    }

    const socketConnection = io("https://dev.enterprise-egy.com", {
      transports: ["websocket"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketConnection.on("connect", () => {
      console.log("Socket connected successfully");
      console.log("Connected via:", socketConnection.io.engine.transport.name);

      console.log("🚀 Emitting join-unit event with:", {
        unitId,
        token: token ? "***" : null,
      });
      socketConnection.emit("join-unit", { unitId, token }, (response) => {
        console.log("📥 Server acknowledgment for join-unit:", response);
      });

      setTimeout(() => {
        if (!joinedUnitRoom) {
          console.log("- Server not responding to join-unit event");
          console.log("- Invalid or expired token");
          console.log("- Unit ID not found");
          console.log("- Socket connection issues");
        }
      }, 3000);

      setIsSocketConnected(true);
    });

    socketConnection.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsSocketConnected(false);
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsSocketConnected(false);
    });

    socketConnection.on("joined-unit", (data) => {
      console.log("✅ Successfully joined unit room:", data);
      setJoinedUnitRoom(true);
    });

    socketConnection.on("join-unit-error", (error) => {
      console.error("❌ Failed to join unit room:", error);
    });

    // Listen for any event to debug what the server is sending
    socketConnection.onAny((eventName, data) => {
      console.log("📡 Socket event received:", eventName, data);
    });

    socketConnection.on("error", (error) => {
      console.error("Socket error:", error.message || error);
    });

    socketConnection.on("bid-updated", (data) => {
      if (data?.message) {
        showBidNotificationMessage(data.message);
      } else {
        showBidNotificationMessage("مزايدة جديدة حدثت");
      }

      playBidNotificationSound();
    });

    socketConnection.on("top-bidders-updated", (data) => {
      if (data && data.data && Array.isArray(data.data)) {
        setLiveTopBidders((prevBidders) => {
          const prevCount = prevBidders.length;
          const newCount = data.data.length;

          if (newCount > prevCount && newCount > 0) {
            const latestBidder = data.data[0];
            if (latestBidder && latestBidder.bidder_name) {
              showBidNotificationMessage(
                `قام ${latestBidder.bidder_name} بالمزايدة علي ${latestBidder.advance_value}% من قيمة المقدم`
              );
            }
          }

          return data.data;
        });

        playBidNotificationSound();
      }
    });

    return () => {
      socketConnection.emit("leave-unit", unitId);
      socketConnection.on("left-unit", (data) => {
        console.log("Successfully left unit room:", data);
      });
      socketConnection.disconnect();
    };
  }, [
    unitId,
    playBidNotificationSound,
    bidder,
    joinedUnitRoom,
    showBidNotificationMessage,
    token,
  ]);
  return {
    notificationMessage,
    isSocketConnected,
    liveTopBidders,
    showBidNotification,
    setShowBidNotification,
  };
}

export default useUnitSocket;
