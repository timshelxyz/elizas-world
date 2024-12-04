import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Tweet {
  id: string;
  text: string;
  author: string;
  authorHandle: string;
  timestamp: string;
  profileImageUrl: string;
}

export function UnifiedTweetStream({ token }: { token: any }) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTweets() {
      try {
        // Get Twitter handle from token info
        const twitterHandle = token.info?.socials?.find(
          (social: any) => social.type === 'twitter'
        )?.handle;

        if (!twitterHandle) {
          setTweets([]);
          return;
        }

        // TODO: Replace with actual Twitter API integration
        // For now, using mock data
        const mockTweets: Tweet[] = [
          {
            id: '1',
            text: `Just another day in the Elizaverse! Building autonomous AI systems that work together. #AI #Elizaverse`,
            author: token.baseToken.name,
            authorHandle: twitterHandle,
            timestamp: new Date().toISOString(),
            profileImageUrl: token.info?.imageUrl || '/default-token.png'
          }
        ];

        setTweets(mockTweets);
      } catch (error) {
        console.error('Error fetching tweets:', error);
        setTweets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTweets();
  }, [token]);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Live Tweet Stream</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading tweets...</div>
          ) : tweets.map(tweet => (
            <div key={tweet.id} className="p-4 border rounded-lg">
              <div className="flex items-center">
                <img src={tweet.profileImageUrl} alt={tweet.author} className="w-10 h-10 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{tweet.author}</h3>
                  <p className="text-sm text-gray-500">{tweet.authorHandle}</p>
                </div>
              </div>
              <p className="mt-2">{tweet.text}</p>
              <p className="text-sm text-gray-500">{tweet.timestamp}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 