import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { generateDemoCrowdData } from '../utils/demoData';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [crowdUpdates, setCrowdUpdates] = useState([]);
  const socketRef = useRef(null);
  const demoIntervalRef = useRef(null);

  const startDemoUpdates = useCallback(() => {
    if (demoIntervalRef.current) return;
    demoIntervalRef.current = setInterval(() => {
      const demoData = generateDemoCrowdData();
      const randomIndex = Math.floor(Math.random() * demoData.length);
      const update = {
        ...demoData[randomIndex],
        timestamp: new Date().toISOString(),
      };
      setCrowdUpdates((prev) => [update, ...prev].slice(0, 50));
      setLastUpdate(new Date().toISOString());
    }, 10000);
  }, []);

  const stopDemoUpdates = useCallback(() => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    try {
      const socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        timeout: 5000,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setIsConnected(true);
        stopDemoUpdates();
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        startDemoUpdates();
      });

      socket.on('crowd-update', (data) => {
        setCrowdUpdates((prev) => [data, ...prev].slice(0, 50));
        setLastUpdate(new Date().toISOString());
      });

      socket.on('connect_error', () => {
        setIsConnected(false);
        startDemoUpdates();
      });

      return () => {
        socket.disconnect();
        stopDemoUpdates();
      };
    } catch {
      // Socket.IO not available, use demo updates
      startDemoUpdates();
      return () => stopDemoUpdates();
    }
  }, [startDemoUpdates, stopDemoUpdates]);

  return { isConnected, lastUpdate, crowdUpdates };
}
