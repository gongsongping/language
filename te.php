<!-- app = Rack::Builder.new do
  map "/" do
    run Proc.new {|env| [200, {"Content-Type" => "text/html"}, ["This is public"]] }
  end

  map "/secret" do
    run Proc.new {|env| [200, {"Content-Type" => "text/html"}, ["Shhhh"]] }
  end
end

run app -->
