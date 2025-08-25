import { Search } from "lucide-react";
import React from "react";

const NoInterview = () => {
  return (
    <div className="text-center py-12">
      <div className="text-muted-foreground mb-4">
        <Search className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No interviews found</h3>
      <p className="text-muted-foreground">
        Try adjusting your search criteria or filters
      </p>
    </div>
  );
};

export default NoInterview;
