import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MessageSquare, ThumbsUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialFeedbackData = [
  {
    id: 1,
    user: "John Doe",
    rating: 5,
    category: "feature",
    subject: "Great agricultural marketplace!",
    message: "Love the new UI updates for the farm products. Everything is so much easier to navigate now.",
    date: "2024-01-15",
    status: "resolved",
  },
  {
    id: 2,
    user: "Jane Smith",
    rating: 4,
    category: "bug",
    subject: "Payment issue for livestock purchase",
    message: "Had some trouble with payment processing for my cattle purchase, but support was helpful.",
    date: "2024-01-14",
    status: "in-progress",
  },
  {
    id: 3,
    user: "Bob Johnson",
    rating: 3,
    category: "suggestion",
    subject: "Need better crop categorization",
    message: "Would really appreciate more detailed categories for different crop types and seasonal products.",
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: 4,
    user: "Alice Williams",
    rating: 5,
    category: "feature",
    subject: "Excellent customer service",
    message: "The support team resolved my farming equipment inquiry within hours. Very impressed!",
    date: "2024-01-12",
    status: "resolved",
  },
  {
    id: 5,
    user: "Charlie Brown",
    rating: 2,
    category: "bug",
    subject: "Search not finding seeds properly",
    message: "The search function returns irrelevant results when looking for specific seed varieties.",
    date: "2024-01-11",
    status: "in-progress",
  },
  {
    id: 6,
    user: "Diana Prince",
    rating: 5,
    category: "feature",
    subject: "Love the mobile app for farmers",
    message: "The mobile experience is fantastic for managing farm listings on the go. Very smooth and responsive.",
    date: "2024-01-10",
    status: "resolved",
  },
];

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState(initialFeedbackData);
  const { toast } = useToast();

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    setFeedback(feedback.map(item =>
      item.id === id
        ? { ...item, status: newStatus }
        : item
    ));
    toast({
      title: "Status Updated",
      description: `Feedback #${id} status changed to ${newStatus}`,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-warning text-warning" : "text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "feature":
        return <ThumbsUp className="h-4 w-4" />;
      case "bug":
        return <AlertCircle className="h-4 w-4" />;
      case "suggestion":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">User Feedback</h2>
        <p className="text-muted-foreground mt-1">Monitor and respond to user feedback and reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,247</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">4.3</div>
              <Star className="h-5 w-5 fill-warning text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">1,034</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="grid gap-4">
        {filteredFeedback.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-foreground">{item.subject}</h3>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="font-medium text-foreground">{item.user}</span>
                      <span>{item.date}</span>
                      {renderStars(item.rating)}
                    </div>
                    <p className="text-foreground mb-4">{item.message}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <Badge
                    variant={
                      item.status === "resolved"
                        ? "default"
                        : item.status === "in-progress"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {item.status}
                  </Badge>
                  <div className="flex gap-2">
                    {item.status !== "resolved" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(item.id, "in-progress")}
                        >
                          Mark In Progress
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStatusChange(item.id, "resolved")}
                        >
                          Mark Resolved
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
