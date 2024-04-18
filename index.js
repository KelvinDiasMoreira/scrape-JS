const { Builder, Browser, By } = require("selenium-webdriver");
const { writeFile } = require("fs");
const chrome = require("selenium-webdriver/chrome");
const { randomUUID } = require("node:crypto");

async function getAllInfo() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  driver.add;
  // const ALPHABET = ["a", "b"];
  // const ALPHABET = ["a"];

  const objectScrapped = [];

  for (let i = 1; i < 22; i++) {
    const URL = `secret`;
    objectScrapped.push(await getInfos(URL));
    writeFile(
      `./data${i}.json`,
      JSON.stringify(objectScrapped, null, 4),
      "utf8",
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  async function getInfos(url) {
    try {
      const object = [];
      await driver.get(url);
      const imageElements = await driver.findElements(
        By.css(`.module .content .items .item .poster img`)
      );
      const nameAnimesElements = await driver.findElements(
        By.css(`.module .content .items .item .data h3 a`)
      );
      for (let i = 0; i < imageElements.length; i++) {
        const imageUrl = await imageElements[i].getAttribute("src");
        const nameAnime = await nameAnimesElements[i].getText();
        object.push({
          id: randomUUID(),
          name: nameAnime,
          srcImage: imageUrl,
          hrefTemporary: await nameAnimesElements[i].getAttribute("href"),
        });
      }
      // const elementPagination = await driver
      //   .findElement(By.css(".pagination span"))
      //   .getText();
      // const currentPage = Number(elementPagination.split(" ")[1]);
      // const totalPage = Number(elementPagination.split(" ")[3]);
      // if (currentPage !== totalPage) {
      //   await getInfos(`secret${currentPage + 1}/`, actualLetter);
      // }
      for (let k = 0; k < object.length; k++) {
        try {
          await driver.get(object[k].hrefTemporary);
          delete object[k].hrefTemporary;

          object[k].year = await driver
            .findElement(By.className("date"))
            .getText();
          const filters = await driver.findElements(By.css(".sgeneros a"));
          object[k].geners = [];
          for (let m = 0; m < filters.length; m++) {
            const gener = await filters[m].getText();
            object[k].geners.push(gener);
          }
          object[k].description = await driver
            .findElement(By.className("wp-content"))
            .getText();
          object[k].totalSeason = (
            await driver.findElements(By.className("se-c"))
          ).length;
          object[k].totalEpisodes = (
            await driver.findElements(By.className("imagen"))
          ).length;
          const episodes = await driver.findElements(
            By.css("#seasons .se-c .se-a ul.episodios li .episodiotitle a")
          );
          console.log(object[k]);
          object[k].episodes = [];
          for (let l = 0; l < episodes.length; l++) {
            object[k].episodes = [
              ...object[k].episodes,
              {
                episode: l + 1,
                url: await episodes[l].getAttribute("href"),
              },
            ];
            console.log(object[k].episodes);
          }
          for (let n = 0; n < object[k].episodes.length; n++) {
            await driver.get(object[k].episodes[n].url);
            object[k].episodes[n].url = await driver
              .findElement(By.className("metaframe rptss"))
              .getAttribute("src");
            console.log(object[k].episodes[n]);
          }
        } catch (err) {
          continue;
        }
      }
      return object;
    } catch (err) {
      console.log(err);
    }
  }

  driver.quit();
}

getAllInfo();
