import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Random;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class ParserMain {

    public static void main(String[] args) {

        //String in the format "MM/DD/YYYY" to be used in getMenu() URL
        String dateStr = getDateInFormat(0);
        //DEBUG
        System.out.println(dateStr);

        //518 = PKS, 514 = EVK, 27229 = Village
        int venue = 518;

        //DOM of target website
        Document doc = getDOM(venue, dateStr);
        //DEBUG
        System.out.printf("Title: %s\n", doc.title());

        //Inner container @DOM:235
        Element containerMenu = doc.selectFirst(".hsp-accordian-container");
        //Parse DOM into Menu
        Menu menu = parseMenu(containerMenu);

        //Send to file
        File file = new File("D:\\VSCodeJS\\usc_hospitality_menu\\usc_hospitality.json");
        ObjectMapper mapper = new ObjectMapper();
        ObjectWriter writer = mapper.writerWithDefaultPrettyPrinter();
        try {
            writer.writeValue(file, menu);
        } catch(Exception e) {

        }

    }

    /**
     * Generates a String in the format "MM/DD/YYYY" to be used in getDOM()
     *
     * @param nextNDay N days from function call, e.g. n=1 is tomorrow
     */
    public static String getDateInFormat(int nextNDay) {
        //Initialize Calendar c with today's date
        Calendar c = Calendar.getInstance();
        //Increment date by nextNDay
        c.add(Calendar.DATE, nextNDay);
        //Parse date
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");

        return sdf.format(c.getTime());
    }

    /**
     * Fetches USC Hospitality Menu DOM with JSoup
     *
     * @param venue 518 = PKS, 514 = EVK, 27229 = Village date
     * @param date in "MM/DD/YYYY" format, use getDateInFormat()
     */
    public static Document getDOM(int venue, String date) {
        String url = "https://hospitality.usc.edu/residential-dining-menus//?menu_venue=venue-" + venue
                + "&menu_date=" + date;

        //Document
        Document doc = null;
        try {
            //Fetch with JSoup
             doc = Jsoup.connect(url).get();
        } catch(IOException e) {
            e.printStackTrace();
        }

        return doc;
    }

    /**
     * Parses container into Menu object
     *
     * @param containerMenu container of Menu
     */
    public static Menu parseMenu(Element containerMenu) {

        Menu menu = new Menu();

        menu.menuName = containerMenu.selectFirst("h2").text();
        System.out.println(menu.menuName);

        //Menu grouped by time, abstracted from DOM
        Elements containerMeal = containerMenu.select(".col-sm-6.col-md-4");

        for(Element each : containerMeal) {
            menu.meal.add(parseMeal(each));
        }

        return menu;
    }

    /**
     * Helper method, converts menu listed by time to be used by Counter object
     *
     * @param containerCounter container of menu listed by time
     */
    public static Meal parseMeal(Element containerCounter) {
        Meal meal = new Meal();

        meal.mealName = containerCounter.select("h3").text();
        //DEBUG
        System.out.println(meal.mealName);

        //Counters
        Elements counters = containerCounter.select("h4");

        for(Element each : counters) {
            meal.counter.add(parseCounter(each));
        }

        return meal;
    }

    /**
     * Parses container into Counter object
     *
     * @param containerCounter container of Counter, same as menu listed by time
     */
    public static Counter parseCounter(Element containerCounter) {
        Counter counter = new Counter();

        counter.counterName = containerCounter.text();
        //DEBUG
        System.out.println(counter.counterName);

        //Check if same Container contains "li"
        if(containerCounter.parent().select("li").size()>0) {
            //Foods
            Elements foods = containerCounter.nextElementSibling().select("li");

            for(Element each : foods) {
                counter.food.add(parseFood(each));
            }
        }

        return counter;
    }

    /**
     * Parses container into Food object
     *
     * @param containerFood element where Food is contained
     */
    public static Food parseFood(Element containerFood) {
        Food food = new Food();

        food.foodName = containerFood.ownText();

        Random r = new Random();
        food.calorie = r.nextInt(37)*25 + 100;

        Elements allergens = containerFood.select("i");
        if(allergens.size()>0) {
            for (Element each : allergens) {
                food.allergen.add(each.text());
            }
        } else {
            food.allergen.add("None");
        }


        return food;
    }
}
